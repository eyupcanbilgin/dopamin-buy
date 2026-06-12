import { spawnSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const checks = ["lint", "typecheck", "test", "build"];

function runScript(scriptName) {
  console.log(`\n> npm run ${scriptName}`);
  const result = spawnSync(npmCommand, ["run", scriptName], {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

for (const check of checks) {
  runScript(check);
}

if (process.env.DATABASE_URL?.trim()) {
  runScript("db:verify");
} else {
  console.log("\n> npm run db:verify");
  console.log("Skipped because DATABASE_URL is not set in this shell.");
}

console.log("\nDoply release check passed.");
