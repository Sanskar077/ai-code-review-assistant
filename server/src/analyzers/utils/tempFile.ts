import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/**
 * Writes `content` to a file inside a fresh, uniquely-named temp directory,
 * runs `fn` with that file's absolute path, and always removes the
 * directory afterward — success or failure.
 *
 * The filename is always a fixed, constant name (never derived from user
 * input), so there is no path-traversal surface here regardless of what a
 * submission's original filename looked like.
 */
export async function withTempFile<T>(
  content: string,
  extension: string,
  fn: (filePath: string) => Promise<T>
): Promise<T> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "acr-analysis-"));
  const filePath = path.join(dir, `submission${extension}`);

  try {
    await fs.writeFile(filePath, content, "utf-8");
    return await fn(filePath);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}
