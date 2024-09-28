import { encodeHex } from "jsr:@std/encoding/hex";
import type { HashObject, HashService } from "./hashService.ts";

export const hashObject = async ({
  object,
  algorithm,
}: HashObject): Promise<string> => {
  const messageBuffer = new TextEncoder().encode(object);
  const hashBuffer = await crypto.subtle.digest(algorithm, messageBuffer);

  const oid = encodeHex(hashBuffer);

  return oid;
};

export const hashService: HashService = {
  hashObject,
};
