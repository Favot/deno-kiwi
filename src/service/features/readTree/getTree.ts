import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import type { FeaturesService } from "../FeaturesService.ts";
import { iterTreeEntries } from "./iterTreeEntries.ts";

export const getTree = async (
    fileSystem: FileSystemService,
    featureService: FeaturesService,
    objectId: string,
    basePath = "",
): Promise<Record<string, string>> => {
    const result: Record<string, string> = {};

    const entries = await iterTreeEntries(
        fileSystem,
        featureService,
        objectId,
    );

    if (!entries) {
        return result;
    }

    for (const { type, objectId: id, name } of entries) {
        if (!name) {
            continue;
        }

        if (name.includes("/")) {
            throw new Error(`Invalid name: ${name}`);
        }

        const path = basePath + name;
        if (type === "blob") {
            result[path] = id;
        } else if (type === "tree") {
            const subTree = await getTree(
                fileSystem,
                featureService,
                id,
                `${path}/`,
            );
            Object.assign(result, subTree);
        } else {
            throw new Error(`Unknown tree entry ${type}`);
        }
    }

    return result;
};
