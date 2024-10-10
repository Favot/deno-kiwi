import type { FileSystemService } from "../../adapter/fileSystem/FileSystemService.ts";
import type { HashService } from "../hash/HashService.ts";

export interface FeaturesService {
    init(fileSystem: FileSystemService): Promise<void>;
    printHelp(): void;
    hashObject(
        filePath: string,
        hashService: HashService,
        fileSystem: FileSystemService,
    ): Promise<string>;
    catFile(
        filePath: string,
        hashService: HashService,
        fileSystem: FileSystemService,
    ): Promise<void>;
}
