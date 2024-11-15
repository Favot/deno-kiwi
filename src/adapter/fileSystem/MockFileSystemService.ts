import { OBJECTS_DIR_PATH } from "../../constants.ts";
import type { FileSystemService } from "./FileSystemService.ts";
import {
  DEFAULT_FILE_SYSTEME_VALUE,
  type FileContent,
  ignoredFile,
  subTreeDatabaseFile,
  TEST_DIRECTORY_PATH,
  testFileOne,
  testFileThree,
  testFileTwo,
  topTreeDatabaseFile,
} from "./mockDataFirstCommit.ts";

export class MockFileSystemService implements FileSystemService {
  private directories: Set<string> = new Set();
  private files: Map<string, string> = new Map();
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

  deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.files.delete(filePath);
      this.fileContents.delete(filePath);
      resolve();
    });
  }

  remove(path: string): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.directories.delete(path);
      resolve();
    });
  }

  setFile(filePath: string, content: string): void {
    this.files.set(filePath, content);
  }

  setExistingDirectory(directoryPath: string): void {
    this.directories.add(directoryPath);
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

  setFileContent = ({
    content,
    objectId,
    path = `${OBJECTS_DIR_PATH}/${objectId}`,
  }: {
    content: string;
    objectId: string;
    path?: string;
  }) => {
    this.setFile(path, content);
    this.writeFile(path, new TextEncoder().encode(content));
  };

  setKiwiDirectory = () => {
    this.createDirectory(".kiwi");
    this.createDirectory(".kiwi/objects");
    this.setFile(".kiwi/HEAD", "");
    this.setFileContent({
      content: "",
      objectId: "",
      path: `.kiwi/HEAD`,
    });
  };

  setTestDirectory = () => {
    this.createDirectory(`${TEST_DIRECTORY_PATH}`);
    this.createDirectory(`${TEST_DIRECTORY_PATH}/subdir`);
  };

  setTestFiles = (testFiles: FileContent[]) => {
    testFiles.forEach((fileContent) => {
      this.setFileContent(fileContent);
    });
  };

  setTestProject(): void {
    this.setKiwiDirectory();

    this.setTestDirectory();

    this.setTestFiles([testFileOne, testFileTwo, testFileThree, ignoredFile]);
  }

  setTestDatabaseFiles(): void {
    this.setTestFiles([topTreeDatabaseFile, subTreeDatabaseFile]);
  }

  setTestProjectWithDatabaseFiles(): void {
    this.setKiwiDirectory();
    this.setTestDatabaseFiles();
  }
}
