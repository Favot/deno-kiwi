import { assertEquals } from "@std/assert";
import { parseArguments } from "./parseArguments.ts";

Deno.test("parseArguments should correctly parse CLI arguments", () => {
  const args = parseArguments(["-h", "--init"]);

  assertEquals(args, {
    _: [],
    help: true,
    h: true,
    init: true,
    "--": [],
  });
});
