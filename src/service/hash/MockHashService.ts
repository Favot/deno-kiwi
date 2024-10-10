import type { HashService } from "./HashService.ts";

export class MockHashService implements HashService {
  private hashResults: Map<string, string> = new Map();

  generateHash(
    object: string,
    _algorithm: "SHA-256" | "SHA-1",
  ): Promise<string> {
    const key = `${object}`;
    const result = this.hashResults.get(key);
    if (result === undefined) {
      throw new Error(`No mock result for ${key}`);
    }
    return Promise.resolve(result);
  }

  setHashResult(
    object: string,
    result: string,
  ): void {
    this.hashResults.set(`${object}`, result);
  }

  setDefaultHashResult(): void {
    this.hashResults.set("test content-SHA-256", "generatedHash");
  }
}
