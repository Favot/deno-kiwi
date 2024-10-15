import type { FileSystemService } from "./FileSystemService.ts";

export const testFileOne = {
  path: "./testDirectory/fileOne.ts",
  content: "file one content",
  objectId: "03d831fc8587d8d871eae4a3417034bc3556d577a30f9b69be52ea48c463e347",
  databaseFileContnent: new TextEncoder().encode(
    "blob\x00file one content",
  ),
};

export const testFileTwo = {
  path: "./testDirectory/fileTwo.ts",
  content: "file two content",
  objectID: "8f266486ae7d7587ca09364b606d691fe250f6672ef8382f8e7166fa852feff1",
  databaseFileContnent: new TextEncoder().encode("blob\x00file two content"),
};

export const testFileThree = {
  path: "./testDirectory/subDirectory/fileThree.ts",
  content: "file three content",
  objectID: "381f18f987f1c0e3c7d6e53350baab46067ca2a665a814f249351c0c3caa360c",
  databaseFileContnent: new TextEncoder().encode(
    "blob\x00file three content",
  ),
};

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

  getState(): { files: Map<string, string>; directories: Set<string> } {
    const decoder = new TextDecoder("utf-8");
    const readableFiles = new Map<string, string>();

    for (const [filePath, content] of this.fileContents.entries()) {
      readableFiles.set(filePath, decoder.decode(content));
    }

    return {
      files: readableFiles,
      directories: new Set(this.directories),
    };
  }

  setTestProject(): void {
    this.createDirectory("./.kiwi");
    this.createDirectory("./.kiwi/objects");
    this.createDirectory("./testDirectory");
    this.createDirectory("./testDirectory/subDirectory");

    this.setFile(testFileOne.path, testFileOne.content);
    this.writeFile(
      testFileOne.path,
      new TextEncoder().encode(testFileOne.content),
    );

    this.setFile(testFileTwo.path, testFileTwo.content);
    this.writeFile(
      testFileTwo.path,
      new TextEncoder().encode(testFileTwo.content),
    );

    this.setFile(testFileThree.path, testFileThree.content);
    this.setFile(testFileThree.path, testFileThree.content);
    this.writeFile(
      testFileThree.path,
      new TextEncoder().encode(testFileThree.content),
    );
  }
}
