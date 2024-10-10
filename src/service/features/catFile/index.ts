import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";

export const catFile = async (
    objectId: string,
    fileSystem: FileSystemService,
): Promise<void> => {
    const fileConent = await getObject(objectId, fileSystem);

    console.log(fileConent);
};

const getObject = async (
    objectId: string,
    fileSystemService: FileSystemService,
) => {
    return await fileSystemService.readFile(
        `${OBJECTS_DIR_PATH}/${objectId}`,
    );
};
