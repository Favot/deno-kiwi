import type { FileSystemeService } from "./fileSystemeService.ts";

function executeDirectoryCreation(
  directoryPath: string,
  directoriesCreation: (
    path: string | URL,
    options?: Deno.MkdirOptions | undefined
  ) => Promise<void>
) {
  directoriesCreation(directoryPath);
}

function createDirectoryService(
  directoryPath: string,
  directoriesCreation: (
    path: string | URL,
    options?: Deno.MkdirOptions | undefined
  ) => Promise<void>
) {
  _internals.executeDirectoryCreation(directoryPath, directoriesCreation);
}

export const _internals = { executeDirectoryCreation };

export const fileSystemService: FileSystemeService = {
  createDirectoryService,
};
