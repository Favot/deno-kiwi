import { createDirectoryService } from "../../adapter/fileSysteme/FileSystemOperations.ts";
import type { FileSystemService } from "../../adapter/fileSysteme/FileSystemService.ts";
import { GIT_DIR } from "../../constants.ts";

export const init = async (fileSystem: FileSystemService) => {
  try {
    await createDirectoryService(fileSystem, GIT_DIR);
    await createDirectoryService(fileSystem, `${GIT_DIR}/objects`);
    console.log("Kiwi git repository initialized");
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log("Kiwi git repository already exists");
    } else {
      throw error;
    }
  }
};
