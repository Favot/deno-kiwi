import { assertEquals } from "@std/assert/equals";
import { spy } from "@std/testing/mock";
import { printHelp } from "./help.ts";

Deno.test("printHelp should print help message", () => {
  const titleLog = "Usage: kiwi [OPTIONS...]";
  const optionLog = "\nOptional flags:";
  const initLog =
    "  --init                    Create a empty Kiwi respository or reinsitialize an existing one";
  const helpLog = "  -h, --help                Display this help and exit";

  const spyOnLog = spy(console, "log");
  printHelp();
  assertEquals(spyOnLog.calls.length, 4);

  assertEquals(spyOnLog.calls[0].args, [titleLog]);
  assertEquals(spyOnLog.calls[1].args, [optionLog]);
  assertEquals(spyOnLog.calls[2].args, [helpLog]);
  assertEquals(spyOnLog.calls[3].args, [initLog]);

  spyOnLog.restore();
});
