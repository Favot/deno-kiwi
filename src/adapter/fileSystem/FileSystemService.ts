export interface FileSystemService {
  createDirectory(directoryPath: string): Promise<void>;
  readFile(filePath: string): Promise<string>;
  writeFile(filePath: string, content: Uint8Array): Promise<void>;
  readDir(directoryPath: string): AsyncIterable<Deno.DirEntry>;
}
