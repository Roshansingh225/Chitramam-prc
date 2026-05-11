import cors from "cors";
import express from "express";
import { config } from "./config";
import { checkExcelService } from "./services/excel-client";
import { ensureStorage } from "./services/storage";
import { prcRouter } from "./routes/prc";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use("/api", prcRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  const message = error instanceof Error ? error.message : "Unexpected server error";
  res.status(500).json({ error: message });
});

await ensureStorage();

app.listen(config.port, async () => {
  const excelReady = await checkExcelService();
  console.log(`SAIL PRC API listening on http://localhost:${config.port}`);
  console.log(`Excel service ${excelReady ? "ready" : "not reachable yet"} at ${config.excelServiceUrl}`);
});
