import { assertEquals } from "@std/assert/equals";
import { assertSpyCall, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";
import { catFile, type SplitContentResult, splitFileContent } from "./index.ts";

Deno.test("should log the file content when called", async () => {
    const objectId = "0e08b5e8c10abc3e455b75286ba4a1fbd56e18a5";
    const expectedFileContent = "test content";
    const fileContent = `blob\x00${expectedFileContent}`;

    const fileSystem = new MockFileSystemService();
    fileSystem.setFile(`${OBJECTS_DIR_PATH}/${objectId}`, fileContent);

    const spyOnLog = spy(console, "log");

    await catFile(objectId, fileSystem, "blob");

    assertSpyCall(spyOnLog, 0, {
        args: [expectedFileContent],
    });

    spyOnLog.restore();
});

Deno.test("should split the file conent and retrun the type and content", () => {
    const fileContent = `blob\x00File Content`;

    const expectedResult: SplitContentResult = {
        objectType: "blob",
        content: "File Content",
    };

    const result = splitFileContent(fileContent);

    assertEquals(result, expectedResult);
});
