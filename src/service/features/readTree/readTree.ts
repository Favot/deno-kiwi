import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import type { FeaturesService } from "../FeaturesService.ts";
import { emptyCurrentDirectory } from "./emptyCurrentDirectory.ts";
import { getTree } from "./getTree.ts";

export const readTree = async (
    fileSystem: FileSystemService,
    featuresService: FeaturesService,
    objectId: string,
    workingDirectory: string,
) => {
    const tree = await getTree(
        fileSystem,
        featuresService,
        objectId,
        workingDirectory,
    );

    emptyCurrentDirectory(fileSystem, workingDirectory);

    for (const [filePath, objectId] of Object.entries(tree)) {
        const filePathInWorkingDirectory = `${filePath}`;
        const fileContent = await featuresService.getObject(
            objectId,
            fileSystem,
            "blob",
        );
        await fileSystem.writeFile(
            filePathInWorkingDirectory,
            new TextEncoder().encode(fileContent),
        );
    }
};
