import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import type { ObjectType } from "../../../types/Object.ts";
import type { HashService } from "../../hash/HashService.ts";
import type { FeaturesService } from "../FeaturesService.ts";
import { getIsFileIgnored } from "./ignoreFile.ts";

export type Entrie = {
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
    const entries: Entrie[] = [];

    for await (const entry of fileSystem.readDir(directory)) {
        const currentPath = `${directory}/${entry.name}`;

        if (getIsFileIgnored(entry.name)) {
            continue;
        }

        let type: ObjectType;
        let objectId: string;

        if (entry.isFile) {
            type = "blob";
            const fileContent = await fileSystem.readFile(currentPath);
            objectId = await featureService.hashObject(
                fileContent,
                hashService,
                fileSystem,
                "blob",
            );

            console.log(objectId, currentPath);
        } else if (entry.isDirectory) {
            type = "tree";
            objectId = await writeTree(
                currentPath,
                fileSystem,
                featureService,
                hashService,
            );
        } else {
            continue;
        }
        entries.push({ name: entry.name, objectId, type });
    }

    const tree = entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ type, objectId, name }) => `${type} ${objectId} ${name}`)
        .join("\n");

    return featureService.hashObject(
        tree.toString(),
        hashService,
        fileSystem,
        "tree",
    );
};
