import { assertEquals } from "@std/assert";
import { hashObject } from "./hashObject.ts";

Deno.test("should return the hash of the object", async () => {
  assertEquals(
    await hashObject("hello world"),
    "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
  );
});
