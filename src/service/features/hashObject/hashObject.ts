import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import { HASH_ALGORITHM, OBJECTS_DIR_PATH } from "../../../constants.ts";
import type { ObjectType } from "../../../types/Object.ts";
import type { HashService } from "../../hash/HashService.ts";

export const hashObject = async (
  filePath: string,
  hashService: HashService,
  fileSystem: FileSystemService,
  objectType: ObjectType = "blob",
): Promise<string> => {
  const fileContent = await fileSystem.readFile(filePath);

  if (!fileContent) {
    throw new Error(`The file ${filePath} doesn't have any data to read`);
  }
  const object = `${objectType}\x00${fileContent}`;

  const objectId = await hashService.generateHash(object, HASH_ALGORITHM);

  const newFilePath = `${OBJECTS_DIR_PATH}/${objectId}`;

  try {
    const encodedFileContent = new TextEncoder().encode(object);
    await fileSystem.writeFile(newFilePath, encodedFileContent);
    return objectId;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`File ${filePath} not found`);
    }

    if (error instanceof Deno.errors.PermissionDenied) {
      throw new Error(
        `Permission denied to write the file at ${newFilePath}: ${error.message}`,
      );
    }
    throw new Error(`Failed to write the file at ${newFilePath}`);
  }
};
