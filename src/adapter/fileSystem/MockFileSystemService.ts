import { OBJECTS_DIR_PATH } from "../../constants.ts";
import type { FileSystemService } from "./FileSystemService.ts";

export const testDirectoryPath = "./testDirectory";
type FileContent = {
  content: string;
  objectId: string;
  path: string;
};

type FileData = {
  name: string;
  content: string;
  objectId: string;
};

export const fileOneData: FileData = {
  name: "file1.txt",
  content: "This is a test file One.",
  objectId: "cc0d68fdc82a6841538b6976a52424d9cf55c0c70bb6bbadc074d64a498235d5",
};

export const testFileOne: FileContent = {
  path: `${testDirectoryPath}/${fileOneData.name}`,
  objectId: fileOneData.objectId,
  content: fileOneData.content,
};

export const testFileOneDatabaseFile: FileContent = {
  path: `${OBJECTS_DIR_PATH}/${fileOneData.objectId}`,
  objectId: fileOneData.objectId,
  content: `blob\x00${fileOneData.content}`,
};

export const fileTwoData: FileData = {
  name: "file2.txt",
  content: "This is a test file Two.",
  objectId: "960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325",
};

export const testFileTwo: FileContent = {
  path: `${testDirectoryPath}/${fileTwoData.name}`,
  objectId: fileTwoData.objectId,
  content: fileTwoData.content,
};

export const testFileTwoDatabaseFile: FileContent = {
  path: `${OBJECTS_DIR_PATH}/${fileTwoData.objectId}`,
  objectId: fileTwoData.objectId,
  content: `blob\x00${fileTwoData.content}`,
};

export const fileThreeData: FileData = {
  name: "file3.txt",
  content: "This is a test file Three.",
  objectId: "56b47f7cb4eee6624c4a1147f4b9805189588be1f30f554b54f1003066202832",
};

export const testFileThree: FileContent = {
  path: `${testDirectoryPath}/subdir/${fileThreeData.name}`,
  objectId: fileThreeData.objectId,
  content: fileThreeData.content,
};

export const testFileThreeDatabaseFile: FileContent = {
  path: `${OBJECTS_DIR_PATH}/${fileThreeData.objectId}`,
  objectId: fileThreeData.objectId,
  content: `blob\x00${fileThreeData.content}`,
};

export const topTreeObjectId =
  "ed73c7d3c4e2ee1851913afb0559d076abc7c2bd126f78d8a40e3293431bd81b";

export const topTreeDatabaseFile: FileContent = {
  path: `${OBJECTS_DIR_PATH}/${topTreeObjectId}`,
  objectId: topTreeObjectId,
  content: `tree blob ${fileOneData.objectId} ${fileOneData.name}\n` +
    `blob ${fileTwoData.objectId} ${fileTwoData.name}\n` +
    `tree 8494d7c717f7bdc73a4cce8f96a42d7437e8f3670afbbe41fdbac7169057d6a9 subdir\n`,
};

const subTreeObjectId =
  "8494d7c717f7bdc73a4cce8f96a42d7437e8f3670afbbe41fdbac7169057d6a9";

export const subTreeDatabaseFile: FileContent = {
  path: `${OBJECTS_DIR_PATH}/${subTreeObjectId}`,
  objectId: subTreeObjectId,
  content: `tree blob ${fileThreeData.objectId} ${fileThreeData.name}\n`,
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
    this.createDirectory(`${testDirectoryPath}`);
    this.createDirectory(`${testDirectoryPath}/subdir`);
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
