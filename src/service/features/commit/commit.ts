import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import type { HashService } from "../../hash/HashService.ts";
import type { FeaturesService } from "../FeaturesService.ts";

export const commit = async (
    fileSystem: FileSystemService,
    featureService: FeaturesService,
    hashService: HashService,
    commitMessage: string,
    directoryPath: string = "./",
) => {
    const commitId = await featureService.writeTree(
        directoryPath,
        fileSystem,
        featureService,
        hashService,
    );

    const commitFileContent = `${commitId}\n` +
        `\n` +
        `${commitMessage}\n`;

    return featureService.hashObject(
        commitFileContent,
        hashService,
        fileSystem,
        "tree",
    );
};
