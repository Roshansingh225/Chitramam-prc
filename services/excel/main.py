from __future__ import annotations

import json
import math
import os
import re
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import pandas as pd


PORT = int(os.getenv("EXCEL_SERVICE_PORT", "5055"))
WORKSPACE_ROOT = Path(os.getenv("WORKSPACE_ROOT", Path.cwd())).resolve()


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and math.isnan(value):
        return ""
    if isinstance(value, pd.Timestamp):
        return value.strftime("%d.%m.%Y")
    return re.sub(r"\s+", " ", str(value).strip())


def to_number(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, (int, float)) and not (isinstance(value, float) and math.isnan(value)):
        return float(value)
    text = clean_text(value)
    if not text:
        return None
    negative = text.startswith("(") and text.endswith(")")
    text = text.replace(",", "").replace("/-", "").replace("Rs.", "").replace("₹", "")
    text = text.replace("%", "").replace("(", "").replace(")", "")
    match = re.search(r"-?\d+(?:\.\d+)?", text)
    if not match:
        return None
    number = float(match.group(0))
    return -number if negative else number


def to_percent(value: Any) -> float | None:
    number = to_number(value)
    if number is None:
        return None
    if abs(number) > 1:
        return number / 100
    return number


def money(value: float | None) -> float:
    return round(float(value or 0), 2)


def pct(value: float | None) -> float:
    return round(float(value or 0), 6)


def first_right_value(row: list[Any], index: int) -> str:
    for value in row[index + 1 :]:
        text = clean_text(value)
        if text:
            return text
    return ""


def metadata_from_sheet(df: pd.DataFrame) -> dict[str, Any]:
    metadata: dict[str, Any] = {}
    rows = df.head(14).values.tolist()
    for row in rows:
        labels = [clean_text(cell).lower() for cell in row]
        for idx, label in enumerate(labels):
            if label in {"pr no", "pr no:"}:
                metadata["prNumberText"] = first_right_value(row, idx)
            elif label in {"items", "item"}:
                metadata["itemsDescription"] = first_right_value(row, idx)
            elif label.startswith("nit no"):
                metadata["nitNumber"] = first_right_value(row, idx)
            elif label in {"ev(rs)", "ev (rs)", "ev"}:
                metadata["estimatedValueText"] = first_right_value(row, idx)
            elif label == "mode":
                metadata["mode"] = first_right_value(row, idx)

    pr_text = metadata.get("prNumberText", "")
    pr_number = re.search(r"\b\d{8,12}\b", pr_text)
    if pr_number:
        metadata["prNumber"] = pr_number.group(0)
    dates = re.findall(r"\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b", pr_text)
    if dates:
        metadata["prDate"] = dates[0]
    if len(dates) > 1:
        metadata["prReleaseDate"] = dates[1]
    estimated = to_number(metadata.get("estimatedValueText"))
    if estimated is not None:
        metadata["estimatedValue"] = money(estimated)
    return metadata


def normalize_header(value: Any) -> str:
    text = clean_text(value).lower()
    text = text.replace("l-1", "l1").replace("l 1", "l1")
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def find_table_header(df: pd.DataFrame) -> int | None:
    for idx, row in df.iterrows():
        headers = [normalize_header(cell) for cell in row.tolist()]
        joined = " | ".join(headers)
        if "pr sn" in joined and "material" in joined and ("total ev" in joined or "unit ev" in joined):
            return int(idx)
    return None


def header_map(headers: list[Any]) -> dict[str, int]:
    mapped: dict[str, int] = {}
    normalized = [normalize_header(header) for header in headers]
    dev_seen = 0
    for idx, text in enumerate(normalized):
        if not text:
            continue
        if text == "pr sn" or text.startswith("pr sn"):
            mapped.setdefault("prSn", idx)
        elif text == "material":
            mapped.setdefault("material", idx)
        elif "short text" in text or "description" in text:
            mapped.setdefault("shortText", idx)
        elif "pr qty" in text or text == "qty":
            mapped.setdefault("quantity", idx)
        elif text == "uom" or "unit of measure" in text:
            mapped.setdefault("uom", idx)
        elif "unit ev" in text:
            mapped.setdefault("unitEv", idx)
        elif "total ev" in text:
            mapped.setdefault("totalEv", idx)
        elif "l1 lcns price" in text or ("l1" in text and "price" in text and "neg" not in text):
            mapped.setdefault("l1Price", idx)
        elif text.startswith("dev"):
            key = "l1Deviation" if dev_seen == 0 else "negotiatedDeviation"
            mapped.setdefault(key, idx)
            dev_seen += 1
        elif "allow" in text and "dev" in text:
            mapped.setdefault("allowableDeviation", idx)
        elif "bidder" in text:
            mapped.setdefault("l1Bidder", idx)
        elif "basis" in text or "lpp" in text:
            mapped.setdefault("basisOfEstimate", idx)
        elif "neg" in text and "price" in text:
            mapped.setdefault("negotiatedPrice", idx)
    return mapped


def cell(row: list[Any], mapping: dict[str, int], key: str) -> Any:
    idx = mapping.get(key)
    if idx is None or idx >= len(row):
        return None
    return row[idx]


def material_label(short_text: str) -> str:
    text = clean_text(short_text).upper()
    if not text:
        return ""
    core = "IWRC" if "IWRC" in text else "FMC" if "FMC" in text else ""
    dia_match = re.search(r"DIA\s*:?\s*(\d+(?:\.\d+)?)\s*MM", text)
    if dia_match and core:
        diameter = dia_match.group(1).rstrip("0").rstrip(".")
        return f"SWR-{core}-{diameter}MM"
    return text[:42]


def parse_items(df: pd.DataFrame, sheet_name: str) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    header_index = find_table_header(df)
    if header_index is None:
        return [], {}
    headers = df.iloc[header_index].tolist()
    mapping = header_map(headers)
    items: list[dict[str, Any]] = []
    totals: dict[str, Any] = {}
    serial = 1
    for _, series in df.iloc[header_index + 1 :].iterrows():
        row = series.tolist()
        pr_sn = to_number(cell(row, mapping, "prSn"))
        material = clean_text(cell(row, mapping, "material"))
        short_text = clean_text(cell(row, mapping, "shortText"))
        total_ev = to_number(cell(row, mapping, "totalEv"))
        l1_price = to_number(cell(row, mapping, "l1Price"))

        has_total_row = pr_sn is None and not material and not short_text and (total_ev is not None or l1_price is not None)
        if has_total_row:
            totals["estimatedValue"] = money(total_ev)
            totals["l1Price"] = money(l1_price)
            l1_dev = to_percent(cell(row, mapping, "l1Deviation"))
            if l1_dev is not None:
                totals["l1Deviation"] = pct(l1_dev)
            continue

        if pr_sn is None or not material:
            if len(items) > 0 and not any(clean_text(x) for x in row):
                break
            continue

        quantity = to_number(cell(row, mapping, "quantity")) or 0
        unit_ev = to_number(cell(row, mapping, "unitEv"))
        if total_ev is None and unit_ev is not None:
            total_ev = unit_ev * quantity
        if l1_price is None:
            l1_price = 0
        l1_deviation = to_percent(cell(row, mapping, "l1Deviation"))
        if l1_deviation is None and total_ev:
            l1_deviation = (l1_price - total_ev) / total_ev
        negotiated = to_number(cell(row, mapping, "negotiatedPrice"))
        negotiated_deviation = to_percent(cell(row, mapping, "negotiatedDeviation"))
        allowable = to_percent(cell(row, mapping, "allowableDeviation"))
        basis = clean_text(cell(row, mapping, "basisOfEstimate"))
        bidder = clean_text(cell(row, mapping, "l1Bidder")) or "Not detected"
        item = {
            "itemNo": serial,
            "prSn": int(pr_sn) if pr_sn.is_integer() else pr_sn,
            "materialCode": material,
            "material": material_label(short_text),
            "shortText": short_text,
            "quantity": money(quantity),
            "uom": clean_text(cell(row, mapping, "uom")),
            "unitEv": money(unit_ev),
            "totalEv": money(total_ev),
            "l1Price": money(l1_price),
            "l1Deviation": pct(l1_deviation),
            "allowableDeviation": pct(allowable),
            "l1Bidder": bidder,
            "basisOfEstimate": basis,
            "negotiatedPrice": money(negotiated) if negotiated is not None else None,
            "negotiatedDeviation": pct(negotiated_deviation) if negotiated_deviation is not None else None,
            "savings": None,
            "sourceSheet": sheet_name,
        }
        items.append(item)
        serial += 1
    return items, totals


def numeric_rows(df: pd.DataFrame) -> list[list[float]]:
    rows: list[list[float]] = []
    for _, series in df.iterrows():
        nums = [to_number(value) for value in series.tolist()]
        values = [float(value) for value in nums if value is not None]
        if len(values) >= 2:
            rows.append(values)
    return rows


def attach_aux_negotiation(items: list[dict[str, Any]], sheets: dict[str, pd.DataFrame]) -> None:
    if not items:
        return
    best_rows: list[list[float]] = []
    best_score = -1
    for sheet_name, df in sheets.items():
        rows = numeric_rows(df)
        if len(rows) < max(1, len(items) // 2):
            continue
        score = 0
        for idx, item in enumerate(items):
            if idx >= len(rows):
                break
            l1 = item.get("l1Price") or 0
            total_ev = item.get("totalEv") or 0
            for value_index, number in enumerate(rows[idx]):
                if abs(number - l1) <= max(1.0, abs(l1) * 0.002) and value_index + 1 < len(rows[idx]):
                    negotiated_candidate = rows[idx][value_index + 1]
                    if negotiated_candidate >= max(1.0, total_ev * 0.2):
                        score += 1
                    break
        if score > best_score:
            best_score = score
            best_rows = rows

    if best_score <= 0:
        return

    for idx, item in enumerate(items):
        if idx >= len(best_rows):
            continue
        row = best_rows[idx]
        l1 = item.get("l1Price") or 0
        l1_index = None
        for value_index, value in enumerate(row):
            if abs(value - l1) <= max(1.0, abs(l1) * 0.002):
                l1_index = value_index
                break
        if l1_index is None or l1_index + 1 >= len(row):
            continue
        negotiated = row[l1_index + 1]
        savings = row[l1_index + 2] if l1_index + 2 < len(row) else l1 - negotiated
        if item["negotiatedPrice"] is None or item["negotiatedPrice"] == 0:
            item["negotiatedPrice"] = money(negotiated)
        if item["savings"] is None:
            item["savings"] = money(max(0, savings))


def finalize_items(items: list[dict[str, Any]]) -> None:
    for item in items:
        if item["negotiatedPrice"] is None or item["negotiatedPrice"] == 0:
            item["negotiatedPrice"] = item["l1Price"]
        if item["negotiatedDeviation"] is None:
            total_ev = item.get("totalEv") or 0
            item["negotiatedDeviation"] = pct((item["negotiatedPrice"] - total_ev) / total_ev) if total_ev else 0
        if item["savings"] is None:
            item["savings"] = money(max(0, (item.get("l1Price") or 0) - (item.get("negotiatedPrice") or 0)))
        allowable = item.get("allowableDeviation") or 0
        negotiated_deviation = item.get("negotiatedDeviation") or 0
        item["requiresFurtherNegotiation"] = negotiated_deviation > allowable
        item["withinAllowableRange"] = negotiated_deviation <= allowable
        item["abnormalDeviation"] = negotiated_deviation > max(allowable * 1.5, allowable + 0.05)


def build_summary(metadata: dict[str, Any], items: list[dict[str, Any]], totals: dict[str, Any]) -> dict[str, Any]:
    total_ev = money(sum(item["totalEv"] for item in items))
    total_l1 = money(sum(item["l1Price"] for item in items))
    total_negotiated = money(sum(item["negotiatedPrice"] for item in items))
    savings = money(sum(item["savings"] for item in items))
    vendors: dict[str, int] = {}
    for item in items:
        vendor = item.get("l1Bidder") or "Not detected"
        vendors[vendor] = vendors.get(vendor, 0) + 1
    return {
        "estimatedValue": money(totals.get("estimatedValue") or metadata.get("estimatedValue") or total_ev),
        "computedEstimatedValue": total_ev,
        "l1Value": money(totals.get("l1Price") or total_l1),
        "negotiatedValue": total_negotiated,
        "savings": savings,
        "l1Deviation": pct(((total_l1 - total_ev) / total_ev) if total_ev else 0),
        "negotiatedDeviation": pct(((total_negotiated - total_ev) / total_ev) if total_ev else 0),
        "itemCount": len(items),
        "requiresFurtherNegotiation": [item["itemNo"] for item in items if item["requiresFurtherNegotiation"]],
        "recommendedItems": [item["itemNo"] for item in items if item["withinAllowableRange"]],
        "l1Vendors": vendors,
    }


def extract_workbook(workbook_path: str) -> dict[str, Any]:
    path = Path(workbook_path).expanduser().resolve()
    if not path.exists():
        raise FileNotFoundError(f"Workbook not found: {path}")
    sheets = pd.read_excel(path, sheet_name=None, header=None)
    price_sheet_name = "Price" if "Price" in sheets else next(iter(sheets.keys()))
    price_sheet = sheets[price_sheet_name]
    metadata = metadata_from_sheet(price_sheet)
    items, totals = parse_items(price_sheet, price_sheet_name)

    if not items:
        for sheet_name, df in sheets.items():
            items, totals = parse_items(df, sheet_name)
            if items:
                metadata.update(metadata_from_sheet(df))
                break

    attach_aux_negotiation(items, sheets)
    finalize_items(items)
    summary = build_summary(metadata, items, totals)
    return {
        "sourceFile": path.name,
        "extractedAt": datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "sheets": list(sheets.keys()),
        "metadata": metadata,
        "items": items,
        "summary": summary,
    }


class ExcelHandler(BaseHTTPRequestHandler):
    server_version = "SAILExcelService/1.0"

    def json_response(self, status: int, body: dict[str, Any]) -> None:
        payload = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "content-type")
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self) -> None:
        self.json_response(200, {"ok": True})

    def do_GET(self) -> None:
        if urlparse(self.path).path == "/health":
            self.json_response(200, {"ok": True, "service": "excel"})
        else:
            self.json_response(404, {"error": "Not found"})

    def do_POST(self) -> None:
        if urlparse(self.path).path != "/extract":
            self.json_response(404, {"error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
            workbook_path = payload.get("workbookPath")
            if not workbook_path:
                self.json_response(400, {"error": "workbookPath is required"})
                return
            self.json_response(200, extract_workbook(workbook_path))
        except Exception as exc:
            self.json_response(500, {"error": str(exc)})


def run() -> None:
    server = ThreadingHTTPServer(("0.0.0.0", PORT), ExcelHandler)
    print(f"Excel microservice listening on http://localhost:{PORT}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    run()
