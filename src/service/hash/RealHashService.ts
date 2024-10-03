import { encodeHex } from "jsr:@std/encoding/hex";
import type { HashService } from "./HashService.ts";

export class RealHashService implements HashService {
  async hashObject(
    object: string,
    algorithm: "SHA-256" | "SHA-1"
  ): Promise<string> {
    const messageBuffer = new TextEncoder().encode(object);
    const hashBuffer = await crypto.subtle.digest(algorithm, messageBuffer);
    return encodeHex(hashBuffer);
  }
}
