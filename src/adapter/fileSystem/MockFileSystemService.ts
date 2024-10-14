import type { FileSystemService } from "./FileSystemService.ts";

export const DEFAULT_FILE_SYSTEME_VALUE = {
  fileContent: "test content",
  fileName: "test.txt",
};

export class MockFileSystemService implements FileSystemService {
  private files: Map<string, string> = new Map();
  private directories: Set<string> = new Set();
  private fileContents: Map<string, Uint8Array> = new Map();

  createDirectory(directoryPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.directories.has(directoryPath)) {
        reject(new Error(`Directory ${directoryPath} already exists`));
      } else {
        this.directories.add(directoryPath);
        resolve();
      }
    });
  }

  readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const content = this.files.get(filePath);
      if (content === undefined) {
        reject(new Error(`File ${filePath} not found`));
      } else {
        resolve(content);
      }
    });
  }

  writeFile(filePath: string, content: Uint8Array): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.fileContents.set(filePath, content);
      resolve();
    });
  }

  async *readDir(directoryPath: string): AsyncIterable<Deno.DirEntry> {
    const directoryPathWithSlash = directoryPath.endsWith("/")
      ? directoryPath
      : `${directoryPath}/`;

    for (const file of this.files.keys()) {
      if (file.startsWith(directoryPathWithSlash)) {
        const relativePath = file.slice(directoryPathWithSlash.length);
        if (!relativePath.includes("/")) { // Ensure it's a direct child
          yield {
            name: relativePath,
            isFile: true,
            isDirectory: false,
            isSymlink: false,
          };
        }
      }
    }

    for (const dir of this.directories) {
      if (dir.startsWith(directoryPathWithSlash)) {
        const relativePath = dir.slice(directoryPathWithSlash.length);
        if (!relativePath.includes("/")) { // Ensure it's a direct child
          yield {
            name: relativePath,
            isFile: false,
            isDirectory: true,
            isSymlink: false,
          };
        }
      }
    }
  }

  setFile(filePath: string, content: string): void {
    this.files.set(filePath, content);
  }

  setExistingDirectory(directoryPath: string): void {
    this.directories.add(directoryPath);
  }

  setFileContent(filePath: string, content: Uint8Array): void {
    this.fileContents.set(filePath, content);
  }

  setDefaultFileContent(): void {
    this.files.set(
      DEFAULT_FILE_SYSTEME_VALUE.fileName,
      DEFAULT_FILE_SYSTEME_VALUE.fileContent,
    );
  }

  restore(): void {
    this.files.clear();
    this.directories.clear();
    this.fileContents.clear();
  }
}
