import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import {
    DEFAULT_FILE_SYSTEME_VALUE,
    MockFileSystemService,
} from "../adapter/fileSystem/MockFileSystemService.ts";
import { main } from "../main.ts";
import { RealFeaturesService } from "../service/features/RealFeatureService.ts";
import { MockHashService } from "../service/hash/MockHashService.ts";

Deno.test(
    "should call the catFile function when the --cat-file flag is passed with a file path",
    async () => {
        const mockFileSystem = new MockFileSystemService();
        mockFileSystem.setDefaultFileContent();

        const mockHashService = new MockHashService();
        mockHashService.setDefaultHashResult();

        const featuresService = new RealFeaturesService();
        using catFile = spy(featuresService, "catFile");

        await main({
            inputArgs: ["--catFile=test.txt"],
            fileSystemService: mockFileSystem,
            hashService: mockHashService,
            featureService: featuresService,
        });

        assertSpyCalls(catFile, 1);
        assertSpyCall(catFile, 0, {
            args: [
                DEFAULT_FILE_SYSTEME_VALUE.fileName,
                mockHashService,
                mockFileSystem,
            ],
        });
    },
);

Deno.test(
    "should not call the catFilefunction and should log an error when the --cat-file flag is passed without a file path",
    () => {
        const featuresService = new RealFeaturesService();
        using catFile = spy(featuresService, "catFile");
        const spyConsoleError = spy(console, "error");

        const errorMessage = "Missing file path for --catFile flag";

        main({ inputArgs: ["--catFile"] });

        assertSpyCalls(catFile, 0);
        assertSpyCalls(spyConsoleError, 1);
        assertSpyCall(spyConsoleError, 0, {
            args: [errorMessage],
        });

        spyConsoleError.restore();
    },
);
