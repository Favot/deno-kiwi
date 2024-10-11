import type { FileSystemService } from "./FileSystemService.ts";

export class RealFileSystemService implements FileSystemService {
  async createDirectory(directoryPath: string): Promise<void> {
    try {
      await Deno.mkdir(directoryPath);
    } catch (error) {
      if (error instanceof Deno.errors.AlreadyExists) {
        throw new Error(`Directory ${directoryPath} already exists`);
      }
      throw error;
    }
  }

  async readFile(filePath: string): Promise<string> {
    try {
      return await Deno.readTextFile(filePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new Error(`File ${filePath} not found`);
      }
      throw error;
    }
  }

  async writeFile(filePath: string, content: Uint8Array): Promise<void> {
    try {
      await Deno.writeFile(filePath, content);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new Error(`File ${filePath} not found`);
      }
      throw error;
    }
  }

  readDir(directoryPath: string): AsyncIterable<Deno.DirEntry> {
    return Deno.readDir(directoryPath);
  }
}
