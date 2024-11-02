import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import type { HashService } from "../../hash/HashService.ts";
import type { FeaturesService } from "../FeaturesService.ts";
import { setHead } from "./setHead.ts";

export const commit = async (
    fileSystem: FileSystemService,
    featureService: FeaturesService,
    hashService: HashService,
    commitMessage: string,
    directoryPath: string = "./",
) => {
    const currentTreeId = await featureService.writeTree(
        directoryPath,
        fileSystem,
        featureService,
        hashService,
    );

    const commitFileContent = `${currentTreeId}\n` +
        `\n` +
        `${commitMessage}\n`;

    const commitId = await featureService.hashObject(
        commitFileContent,
        hashService,
        fileSystem,
        "tree",
    );

    await setHead(fileSystem, commitId);

    return commitId;
};
