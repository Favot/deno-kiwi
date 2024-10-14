import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import type { ObjectType } from "../../../types/Object.ts";
import type { HashService } from "../../hash/HashService.ts";
import type { FeaturesService } from "../FeaturesService.ts";
import { getIsFileIgnored } from "./ignoreFile.ts";
import { stringifyEntry } from "./stringifyTree.ts";

export type Tree = {
    type: ObjectType;
    name: string;
    objectId: string;
};

export const writeTree = async (
    directory: string = ".",
    fileSystem: FileSystemService,
    featureService: FeaturesService,
    hashService: HashService,
): Promise<string> => {
    const entries: Tree[] = [];

    let currentPath = `${directory}`;
    for await (const entry of fileSystem.readDir(directory)) {
        currentPath = `${currentPath}/${entry.name}`;

        if (getIsFileIgnored(entry.name)) {
            currentPath = `${directory}`;
            continue;
        }
        if (entry.isFile) {
            const fileContent = await fileSystem.readFile(currentPath);

            const objectID = await featureService.hashObject(
                fileContent,
                hashService,
                fileSystem,
                "blob",
            );

            console.log(objectID, currentPath);
            currentPath = `${directory}`;
        } else if (entry.isDirectory) {
            const objectId = await writeTree(
                currentPath,
                fileSystem,
                featureService,
                hashService,
            );

            entries.push({
                type: "tree",
                name: entry.name,
                objectId,
            });
        }
    }

    const tree = stringifyEntry(entries);

    return featureService.hashObject(
        tree,
        hashService,
        fileSystem,
        "tree",
    );
};
