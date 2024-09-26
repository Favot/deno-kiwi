import { fileSystemService } from "../../adapter/fileSysteme/fileSystemeImplementation.ts";

export const init = (
  directoriesCreation: (
    path: string | URL,
    options?: Deno.MkdirOptions | undefined
  ) => Promise<void>
) => {
  const { createDirectoryService } = fileSystemService;

  createDirectoryService(".kiwi", directoriesCreation);
};
