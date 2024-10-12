import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import type { HashService } from "../../hash/HashService.ts";
import type { FeaturesService } from "../FeaturesService.ts";
import { getIsFileIgnored } from "./ignoreFile.ts";

export const writeTree = async (
    directory: string = ".",
    fileSystem: FileSystemService,
    featureService: FeaturesService,
    hashService: HashService,
) => {
    for await (const entry of fileSystem.readDir(directory)) {
        const fullPath = `${directory}/${entry.name}`;

        if (getIsFileIgnored(entry.name)) {
            return;
        }
        if (entry.isFile) {
            const objectID = await featureService.hashObject(
                fullPath,
                hashService,
                fileSystem,
            );

            console.log(objectID, fullPath);
        } else if (entry.isDirectory) {
            await writeTree(fullPath, fileSystem, featureService, hashService);
        }
    }
};
