import { fileSystemService } from "../../adapter/fileSysteme/fileSystemeImplementation.ts";
import { GIT_DIR } from "../../constants.ts";

export const init = (
  directoriesCreation: (
    path: string | URL,
    options?: Deno.MkdirOptions | undefined
  ) => Promise<void>
) => {
  const { createDirectoryService } = fileSystemService;

  createDirectoryService(GIT_DIR, directoriesCreation);
  createDirectoryService(`${GIT_DIR}/objects`, directoriesCreation);
};
