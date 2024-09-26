export type FileSystemeService = {
  createDirectoryService(
    directoryPath: string,
    directoriesCreation: (
      path: string | URL,
      options?: Deno.MkdirOptions | undefined
    ) => Promise<void>
  ): void;
};
