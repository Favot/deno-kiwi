import { assertEquals } from "@std/assert/equals";
import { assertRejects } from "@std/assert/rejects";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { MockHashService } from "../../hash/MockHashService.ts";
import { hashObject } from "./hashObject.ts";

function setupMockServices(filePath: string, fileContent: string) {
  const mockFileSystem = new MockFileSystemService();
  const mockHashService = new MockHashService();
  mockFileSystem.setFile(filePath, fileContent);
  return { mockFileSystem, mockHashService };
}

Deno.test("hashFile should correctly hash and store file content", async () => {
  const testFilePath = "/test/file.txt";
  const testFileContent = "Hello, World!";
  const expectedHash = "fakehash123";

  const { mockFileSystem, mockHashService } = setupMockServices(
    testFilePath,
    testFileContent,
  );

  const spyWriteFile = spy(mockFileSystem, "writeFile");

  mockHashService.setHashResult(testFileContent, "SHA-256", expectedHash);

  const spyGenerateHash = spy(mockHashService, "generateHash");

  const result = await hashObject(
    testFilePath,
    mockHashService,
    mockFileSystem,
  );

  assertEquals(result, expectedHash);

  assertSpyCalls(spyWriteFile, 1);
  assertSpyCall(spyWriteFile, 0, {
    args: [
      "./.kiwi/objects/" + expectedHash,
      new TextEncoder().encode(testFileContent),
    ],
  });

  assertSpyCalls(spyGenerateHash, 1);
  assertSpyCall(spyGenerateHash, 0, {
    args: [testFileContent, "SHA-256"],
  });

  spyWriteFile.restore();
  spyGenerateHash.restore();
});

Deno.test("hashFile should throw an error when the file is empty", async () => {
  const mockFileSystem = new MockFileSystemService();
  const mockHashService = new MockHashService();

  const testFilePath = "/test/empty.txt";
  mockFileSystem.setFile(testFilePath, "");

  await assertRejects(
    () => hashObject(testFilePath, mockHashService, mockFileSystem),
    Error,
    `The file ${testFilePath} doesn't have any data to read`,
  );
});

Deno.test(
  "hashFile should throw an error when the file does not exist",
  async () => {
    const mockFileSystem = new MockFileSystemService();
    const mockHashService = new MockHashService();

    const testFilePath = "/test/nonexistent.txt";

    await assertRejects(
      () => hashObject(testFilePath, mockHashService, mockFileSystem),
      Error,
      `File ${testFilePath} not found`,
    );
  },
);
