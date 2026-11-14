import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));
const frontend = fileURLToPath(new URL("..", import.meta.url));
const env = {
  ...process.env,
  API_PORT: "8001",
  FRONTEND_PORT: "5174",
  DB_PORT: "5433",
  NETWORK_NAME: "lab-e2e-network",
  VITE_API_URL: "http://localhost:8001",
  CORS_ORIGINS: "http://localhost:5174,http://127.0.0.1:5174",
  E2E_BASE_URL: "http://localhost:5174",
};
const compose = ["compose", "-p", "lab-e2e"];

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} falhou (${result.status}).`);
  }
}

try {
  run("docker", [
    ...compose,
    "up",
    "-d",
    "--build",
    "--wait",
    "db",
    "backend",
    "frontend",
  ]);
  run("docker", [
    ...compose,
    "exec",
    "-T",
    "backend",
    "alembic",
    "upgrade",
    "head",
  ]);
  run(
    process.execPath,
    ["node_modules/@playwright/test/cli.js", "test"],
    frontend,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  // O projeto fixo limita a limpeza aos containers e ao volume de testes.
  try {
    run("docker", [...compose, "down", "-v", "--remove-orphans"]);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
