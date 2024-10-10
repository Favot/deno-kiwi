import type { FileSystemService } from "../../adapter/fileSystem/FileSystemService.ts";
import type { HashService } from "../hash/HashService.ts";
import type { FeaturesService } from "./FeaturesService.ts";
import { hashObject } from "./hashObject/hashObject.ts";
import { printHelp } from "./help/index.ts";
import { init } from "./init/index.ts";

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
    ): Promise<string> => {
        return hashObject(filePath, hashService, fileSystem);
    };
}
