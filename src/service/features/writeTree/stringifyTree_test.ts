import { assertEquals } from "@std/assert/equals";
import type { Entrie } from "./index.ts";
import { stringifyEntry } from "./stringifyTree.ts";

Deno.test("should return the correct string", () => {
    const entry: Entrie[] = [
        {
            type: "blob",
            name: "fileOne.ts",
            objectId:
                "903653f399dbe16ccae0386fa00378deb032fe581d2e4f75988b02a89f613e73",
        },
        {
            type: "blob",
            name: "fileTwo.ts",
            objectId:
                "891add11ce89a795e53a1c05a68b8a118da7ede5ab70fd5e7d10b41a592b85fc",
        },
        {
            type: "tree",
            name: "subDirectory",
            objectId:
                "f6976fe0d6259d4bf6e34a6235738666eaf5e7e8963a25e98cccaaf7989553fd",
        },
    ];

    const expectedResult =
        `blob\x00903653f399dbe16ccae0386fa00378deb032fe581d2e4f75988b02a89f613e73 fileOne.ts
blob\x00891add11ce89a795e53a1c05a68b8a118da7ede5ab70fd5e7d10b41a592b85fc fileTwo.ts
tree\x00f6976fe0d6259d4bf6e34a6235738666eaf5e7e8963a25e98cccaaf7989553fd subDirectory`;

    const result = stringifyEntry(entry);

    assertEquals(result, expectedResult);
});
