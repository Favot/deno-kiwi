import { assertEquals } from "@std/assert/equals";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { RealHashService } from "../../hash/RealHashService.ts";
import { hashObject } from "./hashObject.ts";

Deno.test("hashFile should correctly hash and store file content", async () => {
  const testFilePath = "/test/file.txt";
  const testFileContent = "Hello, World!";

  const mockFileSystem = new MockFileSystemService();
  mockFileSystem.setFile(testFilePath, testFileContent);
  const spyWriteFile = spy(mockFileSystem, "writeFile");

  const mockHashService = new RealHashService();
  const spyGenerateHash = spy(mockHashService, "generateHash");

  const hashFileConent = `blob\x00${testFileContent}`;
  const expectedHash =
    "b5269447bc2afbefb353cbe7c50a1c8262d9b480864375b8ed68a7a6c1c1d9ce";

  const result = await hashObject(
    testFileContent,
    mockHashService,
    mockFileSystem,
  );

  assertSpyCalls(spyGenerateHash, 1);
  assertSpyCall(spyGenerateHash, 0, {
    args: [hashFileConent, "SHA-256"],
  });

  assertSpyCalls(spyWriteFile, 1);
  assertSpyCall(spyWriteFile, 0, {
    args: [
      "./.kiwi/objects/" + expectedHash,
      new TextEncoder().encode(hashFileConent),
    ],
  });

  assertEquals(result, expectedHash);

  spyWriteFile.restore();
  spyGenerateHash.restore();
});
