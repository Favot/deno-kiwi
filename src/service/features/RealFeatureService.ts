import type { FileSystemService } from "../../adapter/fileSystem/FileSystemService.ts";
import { type ObjectType } from "../../types/Object.ts";
import type { HashService } from "../hash/HashService.ts";
import { catFile } from "./catFile/index.ts";
import type { FeaturesService } from "./FeaturesService.ts";
import { getObject } from "./getObject/getObject.ts";
import { hashObject } from "./hashObject/hashObject.ts";
import { printHelp } from "./help/index.ts";
import { init } from "./init/index.ts";
import { writeTree } from "./writeTree/index.ts";

export class RealFeaturesService implements FeaturesService {
    init = (fileSystem: FileSystemService): Promise<void> => {
        return init(fileSystem);
    };

    printHelp = (): void => {
        return printHelp();
    };

    hashObject = (
        filePath: string,
        hashService: HashService,
        fileSystem: FileSystemService,
        objectType: ObjectType = "blob",
    ): Promise<string> => {
        return hashObject(filePath, hashService, fileSystem, objectType);
    };

    catFile(
        objectId: string,
        fileSystem: FileSystemService,
        featureService: FeaturesService,
    ): Promise<void> {
        return catFile(
            objectId,
            fileSystem,
            featureService,
        );
    }

    getObject(
        objectId: string,
        fileSystem: FileSystemService,
        expectedType: ObjectType,
    ): Promise<string> {
        return getObject(objectId, fileSystem, expectedType);
    }

    writeTree(
        fileSystem: FileSystemService,
        featureService: FeaturesService,
        hashService: HashService,
    ): Promise<string> {
        return writeTree(
            "./",
            fileSystem,
            featureService,
            hashService,
        );
    }
}
