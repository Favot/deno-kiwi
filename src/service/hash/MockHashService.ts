import type { HashService } from "./HashService.ts";

export class MockHashService implements HashService {
  private hashResults: Map<string, string> = new Map();

  hashObject(object: string, algorithm: "SHA-256" | "SHA-1"): Promise<string> {
    const key = `${object}-${algorithm}`;
    const result = this.hashResults.get(key);
    if (result === undefined) {
      throw new Error(`No mock result for ${key}`);
    }
    return Promise.resolve(result);
  }

  setHashResult(
    object: string,
    algorithm: "SHA-256" | "SHA-1",
    result: string
  ): void {
    this.hashResults.set(`${object}-${algorithm}`, result);
  }
}
