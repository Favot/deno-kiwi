import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import { GIT_DIR, OBJECTS_DIR_PATH } from "../../../constants.ts";

export const INIT_MESSAGE = {
  success: "Kiwi git repository initialized",
  alreadyExist: "Kiwi git repository already exists",
};

export const init = async (fileSystem: FileSystemService) => {
  try {
    await fileSystem.createDirectory(GIT_DIR);
    await fileSystem.createDirectory(OBJECTS_DIR_PATH);
    console.log(INIT_MESSAGE.success);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log(INIT_MESSAGE.alreadyExist);
    } else {
      throw error;
    }
  }
};
