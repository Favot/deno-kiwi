import { assertEquals } from "@std/assert/equals";
import { assertRejects } from "@std/assert/rejects";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { MockHashService } from "../../hash/MockHashService.ts";
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
    testFilePath,
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
