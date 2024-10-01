import { createDirectoryService } from "../../adapter/fileSysteme/FileSystemOperations.ts";
import type { FileSystemService } from "../../adapter/fileSysteme/FileSystemService.ts";
import { GIT_DIR } from "../../constants.ts";

export const init = async (fileSystem: FileSystemService) => {
  await createDirectoryService(fileSystem, GIT_DIR);
  await createDirectoryService(fileSystem, `${GIT_DIR}/objects`);
};
