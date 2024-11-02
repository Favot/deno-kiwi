import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import { GIT_DIR } from "../../../constants.ts";

export const setHead = (fileSystem: FileSystemService, commitId: string) => {
    return fileSystem.writeFile(
        `${GIT_DIR}/HEAD`,
        new TextEncoder().encode(commitId),
    );
};

export const getHead = (fileSystem: FileSystemService) => {
    try {
        return fileSystem.readFile(`${GIT_DIR}/HEAD`);
    } catch (_error) {
        return "";
    }
};
