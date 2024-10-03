import { assertEquals } from "@std/assert";
import { HASH_ALGORITHM } from "../../constants.ts";
import { hashObject } from "./HashOperations.ts";
import { RealHashService } from "./RealHashService.ts";

Deno.test("should return the hash of the object", async () => {
  const hashService = new RealHashService();
  assertEquals(
    await hashObject(hashService, "hello world", HASH_ALGORITHM),
    "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
  );
});
