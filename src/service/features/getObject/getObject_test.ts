import { assertEquals } from "@std/assert/equals";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";
import {
    getObject,
    type SplitContentResult,
    splitFileContent,
} from "./getObject.ts";

Deno.test("should return the file content when the object type is the same", async () => {
    const objectId = "0e08b5e8c10abc3e455b75286ba4a1fbd56e18a5";
    const expectedFileContent = "test content";
    const fileContent = `blob\x00${expectedFileContent}`;

    const mockFileSystem = new MockFileSystemService();
    mockFileSystem.setFile(`${OBJECTS_DIR_PATH}/${objectId}`, fileContent);

    const result = await getObject(objectId, mockFileSystem, "blob");

    assertEquals(result, expectedFileContent);
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
