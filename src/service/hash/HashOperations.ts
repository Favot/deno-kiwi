import type { HashService } from "./HashService.ts";

export function generateHash(
  hashService: HashService,
  object: string,
  algorithm: "SHA-256" | "SHA-1",
): Promise<string> {
  return hashService.generateHash(object, algorithm);
}
