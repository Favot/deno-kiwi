import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { DEFAULT_FILE_SYSTEME_VALUE } from "../adapter/fileSystem/mockDataFirstCommit.ts";
import {
  MockFileSystemService,
} from "../adapter/fileSystem/MockFileSystemService.ts";
import { main } from "../main.ts";
import { RealFeaturesService } from "../service/features/RealFeatureService.ts";
import { RealHashService } from "../service/hash/RealHashService.ts";

Deno.test(
  "should call the hashObject function when the --hashObject flag is passed with a file path",
  async () => {
    const mockFileSystem = new MockFileSystemService();
    mockFileSystem.setDefaultFileContent();

    const mockHashService = new RealHashService();

    const featuresService = new RealFeaturesService();
    using spyHashObject = spy(featuresService, "hashObject");

    await main({
      inputArgs: ["hash-object", "test.txt"],
      fileSystemService: mockFileSystem,
      hashService: mockHashService,
      featureService: featuresService,
    });

    assertSpyCalls(spyHashObject, 1);
    assertSpyCall(spyHashObject, 0, {
      args: [
        DEFAULT_FILE_SYSTEME_VALUE.fileContent,
        mockHashService,
        mockFileSystem,
      ],
    });
  },
);

Deno.test(
  "should not call the hashObject function and should log an error when the --hashObject flag is passed without a file path",
  () => {
    const featuresService = new RealFeaturesService();
    using spyHashObject = spy(featuresService, "hashObject");
    const spyConsoleError = spy(console, "error");

    main({ inputArgs: ["hash-Object"] });

    assertSpyCalls(spyHashObject, 0);
    assertSpyCalls(spyConsoleError, 1);

    spyConsoleError.restore();
  },
);
