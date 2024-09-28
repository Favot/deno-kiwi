import { encodeHex } from "jsr:@std/encoding/hex";
export const hashObject = async (object: string): Promise<string> => {
  const messageBuffer = new TextEncoder().encode(object);
  const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);

  const oid = encodeHex(hashBuffer);

  return oid;
};
