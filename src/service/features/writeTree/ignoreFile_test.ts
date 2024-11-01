import { assertEquals } from "@std/assert/equals";
import { getIsIgnored } from "./ignoreFile.ts";

Deno.test("Should return true when the file is in the ignore file list", () => {
    const fileName = ".kiwi";

    const isFileIgnored = getIsIgnored(fileName);

    assertEquals(isFileIgnored, true);
});

Deno.test("Should return false when the files is not in the  ignore file list", () => {
    const fileName = "notIgnoredFile";

    const isFileIgnored = getIsIgnored(fileName);

    assertEquals(isFileIgnored, false);
});
