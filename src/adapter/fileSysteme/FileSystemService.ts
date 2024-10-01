export interface FileSystemService {
  createDirectory(directoryPath: string): Promise<void>;
  readFile(filePath: string): Promise<string>;
}
