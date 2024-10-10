import { assertEquals } from "@std/assert/equals";
import { assertRejects } from "@std/assert/rejects";
import { createDirectoryService, readFile } from "./FileSystemOperations.ts";
import { MockFileSystemService } from "./MockFileSystemService.ts";

Deno.test("should create a directory", async () => {
  const mockFileSystem = new MockFileSystemService();
  const directoryPath = "./test";

  await createDirectoryService(mockFileSystem, directoryPath);
});

Deno.test("should read a file successfully", async () => {
  const mockFileSystem = new MockFileSystemService();
  const filePath = "./test.txt";
  const testContent = "test content";

  mockFileSystem.setFile(filePath, testContent);

  const result = await readFile(mockFileSystem, filePath);

  assertEquals(result, testContent);
});

Deno.test("should throw an error if file not found", async () => {
  const mockFileSystem = new MockFileSystemService();
  const filePath = "./nonexistent.txt";

  await assertRejects(
    () => readFile(mockFileSystem, filePath),
    Error,
    `File ${filePath} not found`,
  );
});
