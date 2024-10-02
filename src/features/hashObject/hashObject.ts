// src/features/hashObject/hashObject.ts

import { readFile } from "../../adapter/fileSystem/FileSystemOperations.ts";
import type { FileSystemService } from "../../adapter/fileSystem/FileSystemService.ts";
import { hashObject } from "../../service/hash/HashOperations.ts";
import type { HashService } from "../../service/hash/HashService.ts";

export const hashFile = async (
  filePath: string,
  hashService: HashService,
  fileSystem: FileSystemService
): Promise<string> => {
  const fileContent = await readFile(fileSystem, filePath);

  if (!fileContent) {
    throw new Error(`The file ${filePath} doesn't have any data to read`);
  }

  const objectId = await hashObject(hashService, fileContent, "SHA-256");

  const newFilePath = "./.kiwi/objects/" + objectId;

  await fileSystem.createDirectory(newFilePath);

  const convertedFileContent = new TextEncoder().encode(fileContent);

  await fileSystem.writeFile(newFilePath, convertedFileContent);

  return objectId;
};
