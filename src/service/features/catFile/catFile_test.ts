import { assertSpyCall, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";
import { RealFeaturesService } from "../RealFeatureService.ts";
import { catFile } from "./index.ts";

Deno.test("should log the file content when called", async () => {
    const objectId = "0e08b5e8c10abc3e455b75286ba4a1fbd56e18a5";
    const expectedFileContent = "test content";
    const fileContent = `blob\x00${expectedFileContent}`;

    const mockFileSystem = new MockFileSystemService();
    mockFileSystem.setFile(`${OBJECTS_DIR_PATH}/${objectId}`, fileContent);

    const featuresService = new RealFeaturesService();

    const spyOnLog = spy(console, "log");

    await catFile(objectId, mockFileSystem, featuresService, "blob");

    assertSpyCall(spyOnLog, 0, {
        args: [expectedFileContent],
    });

    spyOnLog.restore();
});
