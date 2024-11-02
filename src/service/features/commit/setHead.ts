import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";

export const setHead = (fileSystem: FileSystemService, commitId: string) => {
    return fileSystem.writeFile(
        `${OBJECTS_DIR_PATH}/HEAD`,
        new TextEncoder().encode(commitId),
    );
};
