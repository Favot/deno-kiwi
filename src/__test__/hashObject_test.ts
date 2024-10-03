import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../adapter/fileSystem/MockFileSystemService.ts";
import { features } from "../features/index.ts";
import { main } from "../main.ts";

Deno.test(
  "should call the hashObject function when the --hashObject flag is passed with a file path",
  () => {
    const mockFileSystem = new MockFileSystemService();

    mockFileSystem.setFile("test.txt", "test content");

    const spyHashObject = spy(features, "hashFile");

    try {
      main({
        inputArgs: ["--hashObject", "test.txt"],
        fileSystemService: mockFileSystem,
      });
    } catch (_error) {
      assertSpyCalls(spyHashObject, 1);
    } finally {
      spyHashObject.restore();
    }
  }
);

Deno.test(
  "shouldn't call the hashObject function when the --hashObject flag is passed without a file path",
  () => {
    const spyHashObject = spy(features, "hashFile");

    main({ inputArgs: ["--hashObject"] });

    assertSpyCalls(spyHashObject, 0);
    spyHashObject.restore();
  }
);

Deno.test(
  "should console log and error when the --hashObject is passed without a file path",
  () => {
    const spyConsoleLog = spy(console, "log");
    const spyConsoleError = spy(console, "error");

    const errorMessage = "Missing file path for --hashObject flag";

    main({ inputArgs: ["--hashObject"] });

    assertSpyCalls(spyConsoleLog, 0);
    assertSpyCalls(spyConsoleError, 1);
    assertSpyCall(spyConsoleError, 0, {
      args: [errorMessage],
    });
    spyConsoleLog.restore();
    spyConsoleError.restore();
  }
);
