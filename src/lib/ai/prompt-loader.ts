import { readFile } from "node:fs/promises";
import path from "node:path";

export async function loadPrompt(relPathFromRepoRoot: string) {
  const full = path.join(process.cwd(), relPathFromRepoRoot);
  return await readFile(full, "utf8");
}

