import { assertEquals } from "@std/assert/equals";
import { assertRejects } from "@std/assert/rejects";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../adapter/fileSystem/MockFileSystemService.ts";
import { MockHashService } from "../../service/hash/MockHashService.ts";
import { hashFile } from "./hashObject.ts";

Deno.test("hashFile should correctly hash a file and store it", async () => {
  const mockFileSystem = new MockFileSystemService();
  const mockHashService = new MockHashService();

  const testFilePath = "/test/file.txt";
  const testFileContent = "Hello, World!";
  const expectedHash = "fakehash123";

  // Set up mock file system
  mockFileSystem.setFile(testFilePath, testFileContent);
  const spyCreateDirectory = spy(mockFileSystem, "createDirectory");
  const spyWriteFile = spy(mockFileSystem, "writeFile");

  // Set up mock hash service
  mockHashService.setHashResult(testFileContent, "SHA-256", expectedHash);
  const spyHashObject = spy(mockHashService, "hashObject");

  const result = await hashFile(testFilePath, mockHashService, mockFileSystem);

  // Assert the result
  assertEquals(result, expectedHash);

  // Assert that the correct methods were called
  assertSpyCalls(spyCreateDirectory, 1);
  assertSpyCall(spyCreateDirectory, 0, {
    args: ["./.kiwi/objects/" + expectedHash],
  });

  assertSpyCalls(spyWriteFile, 1);
  assertSpyCall(spyWriteFile, 0, {
    args: [
      "./.kiwi/objects/" + expectedHash,
      new TextEncoder().encode(testFileContent),
    ],
  });

  assertSpyCalls(spyHashObject, 1);
  assertSpyCall(spyHashObject, 0, {
    args: [testFileContent, "SHA-256"],
  });
});

Deno.test("hashFile should throw an error for empty files", async () => {
  const mockFileSystem = new MockFileSystemService();
  const mockHashService = new MockHashService();

  const testFilePath = "/test/empty.txt";
  mockFileSystem.setFile(testFilePath, "");

  await assertRejects(
    () => hashFile(testFilePath, mockHashService, mockFileSystem),
    Error,
    `The file ${testFilePath} doesn't have any data to read`
  );
});

Deno.test("hashFile should throw an error for non-existent files", async () => {
  const mockFileSystem = new MockFileSystemService();
  const mockHashService = new MockHashService();

  const testFilePath = "/test/nonexistent.txt";

  await assertRejects(
    () => hashFile(testFilePath, mockHashService, mockFileSystem),
    Error,
    `File ${testFilePath} not found`
  );
});
