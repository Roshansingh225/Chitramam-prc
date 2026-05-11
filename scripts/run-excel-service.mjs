import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

const bundledPython = "/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const python = process.env.PYTHON_BIN || (existsSync(bundledPython) ? bundledPython : "python3");

const child = spawn(python, ["services/excel/main.py"], {
  stdio: "inherit",
  env: process.env
});

child.on("exit", (code) => process.exit(code || 0));
