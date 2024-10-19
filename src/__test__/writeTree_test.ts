import { assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../adapter/fileSystem/MockFileSystemService.ts";
import { main } from "../main.ts";
import { RealFeaturesService } from "../service/features/RealFeatureService.ts";

Deno.test("should call writeTree function when the --writeTree flag is passed", () => {
    const featureService = new RealFeaturesService();
    const mockFileSystem = new MockFileSystemService();
    mockFileSystem.setTestProject();
    const spyOnWriteTree = spy(featureService, "writeTree");

    main({
        inputArgs: ["--writeTree"],
        featureService,
        fileSystemService: mockFileSystem,
    });

    assertSpyCalls(spyOnWriteTree, 1);
});
