import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import type { ObjectType } from "../../../types/Object.ts";
import type { FeaturesService } from "../FeaturesService.ts";
import type { Entrie } from "../writeTree/index.ts";

export const iterTreeEntries = async (
    fileSystem: FileSystemService,
    featureService: FeaturesService,
    objectId?: string,
): Promise<Entrie[] | null> => {
    if (!objectId) return null;

    const fileContent = await featureService.getObject(
        objectId,
        fileSystem,
        "tree",
    );

    const entries: Entrie[] = [];

    const tree = fileContent.split("\n");

    for (const entry of tree) {
        const [type, objectId, name] = entry.split(" ");
        entries.push({ type: type as ObjectType, name, objectId });
    }

    return entries;
};
