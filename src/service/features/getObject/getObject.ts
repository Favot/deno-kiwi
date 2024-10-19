import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";
import type { ObjectType } from "../../../types/Object.ts";

export const getObject = async (
    objectId: string,
    fileSystemService: FileSystemService,
    expectedObjectType: ObjectType = "NONE",
) => {
    const fileConent = await fileSystemService.readFile(
        `${OBJECTS_DIR_PATH}/${objectId}`,
    );

    const { objectType, content } = splitFileContent(fileConent);

    if (objectType !== expectedObjectType) {
        throw new Error(`Expected ${expectedObjectType} got ${objectType}`);
    }

    return content;
};

export type SplitContentResult = {
    objectType: ObjectType;
    content: string;
};

export const splitFileContent = (fileContent: string): SplitContentResult => {
    const splitedFileConent = fileContent.split("\x00");

    return {
        objectType: splitedFileConent[0] as ObjectType,
        content: splitedFileConent[1],
    };
};
