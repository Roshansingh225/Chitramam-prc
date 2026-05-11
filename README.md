# SAIL PRC Automation

Full-stack web app for generating SAIL Purchase Department PRC documents from uploaded Excel price sheets and optional previous PRC references.

## Stack

- Next.js, Tailwind CSS, shadcn-style components, Framer Motion
- Node.js + Express API
- Python Excel microservice with pandas/openpyxl
- Gemini API for official procurement drafting
- DOCX export with `docx`, PDF export with `pdf-lib`
- Optional Supabase Auth, PostgreSQL history, and Supabase Storage exports

## Local Setup

```bash
npm install
cp .env.example .env.local
```

Set `GEMINI_API_KEY` in `.env.local`. For Python, either install:

```bash
python3 -m pip install -r services/excel/requirements.txt
```

or set `PYTHON_BIN` to a Python that already has pandas and openpyxl.

Run all services:

```bash
npm run dev
```

Open `http://localhost:3000/dashboard`.

## Workflow

1. Upload `.xlsx` price sheet and optional previous `.docx` PRC.
2. Python extracts PR metadata, item table, L1 prices, negotiated prices, savings, deviations, allowable range, and vendor status.
3. Gemini drafts formal PRC language from structured data.
4. Backend enforces calculated values and guards against unsupported AI claims.
5. User edits generated PRC note.
6. Export official-style DOCX and PDF.

## Environment

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
API_PORT=4000
EXCEL_SERVICE_URL=http://localhost:5055
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=prc-documents
```

The app works with local JSON/file storage by default. Add Supabase variables to persist records in PostgreSQL and mirror exports to Supabase Storage.
