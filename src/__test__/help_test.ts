import { assertEquals } from "@std/assert/equals";
import { spy } from "@std/testing/mock";
import { main } from "../main.ts";

Deno.test(
  "should print the help message when the --help flag is passed",
  () => {
    const spyOnLog = spy(console, "log");
    main(["--help"]);
    assertEquals(spyOnLog.calls.length, 4);
    assertEquals(spyOnLog.calls[0].args, ["Usage: kiwi [OPTIONS...]"]);
    assertEquals(spyOnLog.calls[1].args, ["\nOptional flags:"]);
    assertEquals(spyOnLog.calls[2].args, [
      "  -h, --help                Display this help and exit",
    ]);
    assertEquals(spyOnLog.calls[3].args, [
      "  --init                    Create a empty Kiwi respository or reinsitialize an existing one",
    ]);
    spyOnLog.restore();
  }
);
