import type { FileSystemeService } from "./fileSystemeService.ts";

function createDirectoryService(
  directoryPath: string,
  directoriesCreation: (
    path: string | URL,
    options?: Deno.MkdirOptions | undefined
  ) => Promise<void>
) {
  directoriesCreation(directoryPath);
}

export const fileSystemService: FileSystemeService = {
  createDirectoryService,
};
