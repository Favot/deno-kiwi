import type { FileSystemService } from "./FileSystemService.ts";

export function createDirectoryService(
  fileSystem: FileSystemService,
  directoryPath: string
): Promise<void> {
  return fileSystem.createDirectory(directoryPath);
}

export function readFile(
  fileSystem: FileSystemService,
  filePath: string
): Promise<string> {
  return fileSystem.readFile(filePath);
}

export function writeFile(
  fileSystem: FileSystemService,
  filePath: string,
  content: Uint8Array
): Promise<void> {
  return fileSystem.writeFile(filePath, content);
}
