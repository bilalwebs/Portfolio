/**
 * Snapshot generator for the portfolio chatbot.
 *
 * Bundles the frontend's single source of truth (`src/data/portfolio.ts`)
 * with esbuild, executes it under Node, and writes the resulting data as a
 * plain JSON object into `src/generated/portfolio.data.ts`. The backend chat
 * service reads from that snapshot, so every section of the portfolio —
 * including ones added in the future — is automatically available to the
 * assistant without duplicating any data by hand.
 *
 * Run from the backend directory: npm run sync:portfolio
 */
import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const backendDir = resolve(scriptDir, "..");
const rootDir = resolve(backendDir, "..");

const SOURCE_FILE = resolve(rootDir, "src", "data", "portfolio.ts");
const OUT_FILE = resolve(backendDir, "src", "generated", "portfolio.data.ts");

const assetStubPlugin = {
  name: "asset-stub",
  setup(build) {
    build.onLoad({ filter: /\.(png|jpe?g|gif|svg|webp|ico|avif|pdf)$/ }, () => ({
      contents: "export default '';",
      loader: "js",
    }));
  },
};

const result = await build({
  entryPoints: [SOURCE_FILE],
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
  target: "node20",
  sourcemap: false,
  logLevel: "silent",
  alias: { "@": resolve(rootDir, "src") },
  plugins: [assetStubPlugin],
});

const code = result.outputFiles[0]?.text;
if (!code) {
  throw new Error("esbuild produced no output for the portfolio module");
}

const encoded = Buffer.from(code, "utf8").toString("base64");
const moduleNamespace = await import(
  `data:text/javascript;base64,${encoded}`
);

const portfolioData = {};
for (const [key, value] of Object.entries(moduleNamespace)) {
  if (key === "default") continue;
  portfolioData[key] = value;
}

if (Object.keys(portfolioData).length === 0) {
  throw new Error("No named exports found in src/data/portfolio.ts");
}

const json = JSON.stringify(portfolioData, null, 2);

const content =
  "// AUTO-GENERATED FILE - do not edit manually.\n" +
  "// Regenerate with: npm run sync:portfolio (backend)\n" +
  "// Source of truth: src/data/portfolio.ts\n" +
  "\n" +
  "export type PortfolioData = Record<string, unknown>;\n" +
  "\n" +
  `export const portfolioData: PortfolioData = ${json};\n`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, content, "utf8");

console.log(
  `[sync:portfolio] wrote ${OUT_FILE} (${Object.keys(portfolioData).length} sections)`,
);
