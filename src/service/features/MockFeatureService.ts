import type { FileSystemService } from "../../adapter/fileSystem/FileSystemService.ts";
import type { ObjectType } from "../../types/Object.ts";
import type { HashService } from "../hash/HashService.ts";
import type { FeaturesService } from "./FeaturesService.ts";

export class MockFeatureService implements FeaturesService {
    init = (_fileSystem: FileSystemService): Promise<void> => {
        return Promise.resolve();
    };

    printHelp = (): void => {
        return;
    };

    hashObject = (
        _filePath: string,
        _hashService: HashService,
        _fileSystem: FileSystemService,
        _objectType: ObjectType = "blob",
    ): Promise<string> => {
        return Promise.resolve("test hash");
    };

    catFile(
        _objectId: string,
        _fileSystem: FileSystemService,
        _featureService: FeaturesService,
    ): Promise<void> {
        return Promise.resolve();
    }

    getObject(
        _objectId: string,
        _fileSystem: FileSystemService,
        _expectedType: ObjectType,
    ): Promise<string> {
        return Promise.resolve("test content");
    }

    writeTree(
        _fileSystem: FileSystemService,
        _featureService: FeaturesService,
        _hashService: HashService,
    ): Promise<string> {
        return Promise.resolve("test tree");
    }

    readTree = (
        _fileSystem: FileSystemService,
        _featureService: FeaturesService,
        _objectId: string,
        _workingDirectory: string,
    ): Promise<void> => {
        return Promise.resolve();
    };

    commit(
        _fileSystem: FileSystemService,
        _featureService: FeaturesService,
        _hashService: HashService,
    ): Promise<void> {
        return Promise.resolve();
    }
}
