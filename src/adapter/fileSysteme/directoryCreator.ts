function createDirectory(directoryPath: string) {
  Deno.mkdir(directoryPath);
}

export function directoryCreator(directoryPath: string) {
  _internals.createDirectory(directoryPath);
}

export const _internals = { createDirectory };
