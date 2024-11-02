import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import type { HashService } from "../../hash/HashService.ts";
import type { FeaturesService } from "../FeaturesService.ts";
import { getHead, setHead } from "./setHead.ts";

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

    const headContent = await getHead(fileSystem);

    let commitFileContent = `${currentTreeId}\n`;
    if (headContent.length > 0) {
        commitFileContent += `parent\x00${headContent}\n`;
    }
    commitFileContent += `\n`;
    commitFileContent += `${commitMessage}\n`;

    const commitId = await featureService.hashObject(
        commitFileContent,
        hashService,
        fileSystem,
        "tree",
    );

    await setHead(fileSystem, commitId);

    return commitId;
};
