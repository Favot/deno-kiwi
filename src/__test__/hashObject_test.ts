import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../adapter/fileSystem/MockFileSystemService.ts";
import { features } from "../features/index.ts";
import { main } from "../main.ts";

Deno.test(
  "should call the hashObject function when the --hashObject flag is passed with a file path",
  () => {
    const mockFileSystem = new MockFileSystemService();

    mockFileSystem.setFile("test.txt", "test content");

    const spyHashObject = spy(features, "hashObject");

    try {
      main({
        inputArgs: ["--hashObject=test.txt"],
        fileSystemService: mockFileSystem,
      });
    } catch (_error) {
      assertSpyCalls(spyHashObject, 1);
    } finally {
      spyHashObject.restore();
    }
  },
);

Deno.test(
  "should not call the hashObject function and should log an error when the --hashObject flag is passed without a file path",
  () => {
    const spyHashObject = spy(features, "hashObject");
    const spyConsoleLog = spy(console, "log");
    const spyConsoleError = spy(console, "error");

    const errorMessage = "Missing file path for --hashObject flag";

    main({ inputArgs: ["--hashObject"] });

    assertSpyCalls(spyHashObject, 0);
    assertSpyCalls(spyConsoleLog, 0);
    assertSpyCalls(spyConsoleError, 1);
    assertSpyCall(spyConsoleError, 0, {
      args: [errorMessage],
    });

    spyHashObject.restore();
    spyConsoleLog.restore();
    spyConsoleError.restore();
  },
);
