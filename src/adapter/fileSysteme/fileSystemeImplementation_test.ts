import { assertEquals } from "@std/assert/equals";
import { assertRejects } from "@std/assert/rejects";
import { createDirectoryService, readFile } from "./FileSystemOperations.ts";
import type { FileSystemService } from "./FileSystemService.ts";

export class MockFileSystemService implements FileSystemService {
  private files: Map<string, string> = new Map();
  private directories: Set<string> = new Set();

  async createDirectory(directoryPath: string): Promise<void> {
    if (this.directories.has(directoryPath)) {
      throw new Error(`Directory ${directoryPath} already exists`);
    }
    this.directories.add(directoryPath);
  }

  async readFile(filePath: string): Promise<string> {
    const content = this.files.get(filePath);
    if (content === undefined) {
      throw new Error(`File ${filePath} not found`);
    }
    return content;
  }

  // Helper method for setting up test data
  setFile(filePath: string, content: string): void {
    this.files.set(filePath, content);
  }
}

Deno.test("should create a directory", async () => {
  const mockFileSystem = new MockFileSystemService();
  const directoryPath = "./test";

  await createDirectoryService(mockFileSystem, directoryPath);

  await assertRejects(
    () => createDirectoryService(mockFileSystem, directoryPath),
    Error,
    `Directory ${directoryPath} already exists`
  );
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
    `File ${filePath} not found`
  );
});
