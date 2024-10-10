import { assertEquals } from "@std/assert/equals";
import { spy } from "@std/testing/mock";
import { printHelp } from "./index.ts";

Deno.test("should log the correct text when the help function is called", () => {
    const spyOnLog = spy(console, "log");

    printHelp();

    assertEquals(spyOnLog.calls.length, 5);
    assertEquals(spyOnLog.calls[0].args, ["Usage: kiwi [OPTIONS...]"]);
    assertEquals(spyOnLog.calls[1].args, ["\nOptional flags:"]);
    assertEquals(spyOnLog.calls[2].args, [
        "  -h, --help                Display this help and exit",
    ]);
    assertEquals(spyOnLog.calls[3].args, [
        "  --init                    Create a empty Kiwi respository or reinsitialize an existing one",
    ]);
    assertEquals(spyOnLog.calls[4].args, [
        "  --hash-object            Hash an object",
    ]);
    spyOnLog.restore();
});
