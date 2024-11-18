import { assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../adapter/fileSystem/MockFileSystemService.ts";
import { main } from "../main.ts";
import { MockFeatureService } from "../service/features/MockFeatureService.ts";

Deno.test("should call readTree function when the read-tree flag is passed", () => {
    const featureService = new MockFeatureService();
    const mockFileSystem = new MockFileSystemService();

    const spyOnReadTree = spy(featureService, "readTree");

    main({
        inputArgs: ["read-tree", "./"],
        featureService,
        fileSystemService: mockFileSystem,
    });

    assertSpyCalls(spyOnReadTree, 1);
});
