import { assertEquals } from "@std/assert/equals";
import { getIsFileIgnored } from "./ignoreFile.ts";

Deno.test("Should return true when the file is in the ignore file list", () => {
    const fileName = ".kiwi";

    const isFileIgnored = getIsFileIgnored(fileName);

    assertEquals(isFileIgnored, true);
});

Deno.test("Should return false when the files is not in the  ignore file list", () => {
    const fileName = "notIgnoredFile";

    const isFileIgnored = getIsFileIgnored(fileName);

    assertEquals(isFileIgnored, false);
});
