import { OBJECTS_DIR_PATH } from "../../constants.ts";
import type { FileSystemService } from "./FileSystemService.ts";

type FileContent = {
  content: string;
  objectId: string;
  path: string;
};

export const testDirectoryPath = "./testDirectory";

export const testFileOne: FileContent = {
  path: `${testDirectoryPath}/testDirectory/fileOne.ts`,
  content: "file one content",
  objectId: "03d831fc8587d8d871eae4a3417034bc3556d577a30f9b69be52ea48c463e347",
};

export const testFileTwo: FileContent = {
  path: `${testDirectoryPath}/testDirectory/fileTwo.ts`,
  content: "file two content",
  objectId: "8f266486ae7d7587ca09364b606d691fe250f6672ef8382f8e7166fa852feff1",
};

export const testFileThree: FileContent = {
  path: `${testDirectoryPath}/testDirectory/subDirectory/fileThree.ts`,
  content: "file three content",
  objectId: "381f18f987f1c0e3c7d6e53350baab46067ca2a665a814f249351c0c3caa360c",
};

export const ignoredFile: FileContent = {
  path: `${testDirectoryPath}/ignoredFile.ts`,
  content: "ignored file content",
  objectId: "ignoredFile",
};

export const DEFAULT_FILE_SYSTEME_VALUE = {
  fileContent: "test content",
  fileName: "test.txt",
};

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
    this.createDirectory("./.kiwi");
    this.createDirectory("./.kiwi/objects");
  };

  setTestDirectory = () => {
    this.createDirectory(`${testDirectoryPath}/testDirectory`);
    this.createDirectory(`${testDirectoryPath}/testDirectory/subDirectory`);
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
    const topTreeFile: FileContent = {
      objectId: "1234567890abcdef1234567890abcdef",
      path: `${OBJECTS_DIR_PATH}/1234567890abcdef1234567890abcdef`,
      content:
        "tree\x00blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt\n" +
        "blob 960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112333 file2.txt\n" +
        "tree 960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325 subdir",
    };

    const subTreeFile: FileContent = {
      objectId:
        "960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325",
      path:
        `${OBJECTS_DIR_PATH}/960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325`,
      content:
        "tree\x00blob 960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b91123123 file3.txt",
    };

    this.setTestFiles([topTreeFile, subTreeFile]);
  }

  setTestProjectWithDatabaseFiles(): void {
    this.setKiwiDirectory();
    this.setTestDatabaseFiles();
  }
}
