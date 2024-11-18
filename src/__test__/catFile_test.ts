import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import {
    MockFileSystemService,
} from "../adapter/fileSystem/MockFileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../constants.ts";
import { main } from "../main.ts";
import { RealFeaturesService } from "../service/features/RealFeatureService.ts";
import { MockHashService } from "../service/hash/MockHashService.ts";

Deno.test(
    "should call the catFile function when the --cat-file flag is passed with a object id",
    async () => {
        const objectId = "0e08b5e8c10abc3e455b75286ba4a1fbd56e18a5";
        const mockFileSystem = new MockFileSystemService();
        mockFileSystem.setDefaultFileContent();
        mockFileSystem.setFile(
            `${OBJECTS_DIR_PATH}/0e08b5e8c10abc3e455b75286ba4a1fbd56e18a5`,
            "NONE\x00test content",
        );

        const mockHashService = new MockHashService();
        mockHashService.setDefaultHashResult();

        const featuresService = new RealFeaturesService();
        using catFile = spy(featuresService, "catFile");

        await main({
            inputArgs: ["cat-file", `${objectId}`],
            fileSystemService: mockFileSystem,
            hashService: mockHashService,
            featureService: featuresService,
        });

        assertSpyCalls(catFile, 1);
        assertSpyCall(catFile, 0, {
            args: [
                objectId,
                mockFileSystem,
                featuresService,
            ],
        });
    },
);

Deno.test(
    "should not call the catFilefunction when the --cat-file flag is passed without a object id",
    () => {
        const featuresService = new RealFeaturesService();
        using catFile = spy(featuresService, "catFile");

        main({ inputArgs: ["cat-file"] });

        assertSpyCalls(catFile, 0);
    },
);
