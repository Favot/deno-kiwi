import { assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../adapter/fileSystem/MockFileSystemService.ts";
import { main } from "../main.ts";
import { MockFeatureService } from "../service/features/MockFeatureService.ts";

Deno.test("should call commit function when the --commit flag is passed", () => {
    const featureService = new MockFeatureService();
    const mockFileSystem = new MockFileSystemService();
    mockFileSystem.setTestProject();

    const spyOnCommit = spy(featureService, "commit");

    main({
        inputArgs: ["--commit"],
        featureService,
        fileSystemService: mockFileSystem,
    });

    assertSpyCalls(spyOnCommit, 1);
});
