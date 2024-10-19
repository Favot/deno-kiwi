import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import type { ObjectType } from "../../../types/Object.ts";
import type { FeaturesService } from "../FeaturesService.ts";

export const catFile = async (
    objectId: string,
    fileSystem: FileSystemService,
    featureService: FeaturesService,
    expectedType: ObjectType = "NONE",
): Promise<void> => {
    const fileConent = await featureService.getObject(
        objectId,
        fileSystem,
        expectedType,
    );

    console.log(fileConent);
};
