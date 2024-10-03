import type { HashService } from "./HashService.ts";

export function hashObject(
  hashService: HashService,
  object: string,
  algorithm: "SHA-256" | "SHA-1"
): Promise<string> {
  return hashService.hashObject(object, algorithm);
}
