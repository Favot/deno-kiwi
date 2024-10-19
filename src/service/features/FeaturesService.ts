import type { FileSystemService } from "../../adapter/fileSystem/FileSystemService.ts";
import type { ObjectType } from "../../types/Object.ts";
import type { HashService } from "../hash/HashService.ts";

export interface FeaturesService {
    init(fileSystem: FileSystemService): Promise<void>;
    printHelp(): void;
    hashObject(
        fileContent: string,
        hashService: HashService,
        fileSystem: FileSystemService,
        objectType?: ObjectType,
    ): Promise<string>;

    catFile(
        objectId: string,
        fileSystem: FileSystemService,
        featureService: FeaturesService,
    ): Promise<void>;
    getObject(
        objectId: string,
        fileSystem: FileSystemService,
        expectedType: ObjectType,
    ): Promise<string>;
    writeTree(
        fileSystem: FileSystemService,
        featureService: FeaturesService,
        hashService: HashService,
    ): Promise<string>;
}
