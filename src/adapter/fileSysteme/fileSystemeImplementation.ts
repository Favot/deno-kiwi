import type { FileSystemeService } from "./fileSystemeService.ts";

async function createDirectoryService(
  directoryPath: string,
  directoriesCreation: (
    path: string | URL,
    options?: Deno.MkdirOptions | undefined
  ) => Promise<void>
) {
  try {
    await directoriesCreation(directoryPath); // Await the promise
  } catch (error) {
    console.log(error);
    if (error instanceof Deno.errors.AlreadyExists) {
      throw new Error(`Directory ${directoryPath} already exists`);
    }
  }
}

export const fileSystemService: FileSystemeService = {
  createDirectoryService,
};
