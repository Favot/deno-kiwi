import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../adapter/fileSystem/fileSystemeImplementation_test.ts";
import { GIT_DIR } from "../constants.ts";
import { init } from "../features/index.ts";

Deno.test(
  "should create a new constent directory tracker repository when the --init flag is passed and the repository does not exist",
  async () => {
    const mockFileSystem = new MockFileSystemService();

    const spyCreateDirectory = spy(mockFileSystem, "createDirectory");

    await init(mockFileSystem);

    assertSpyCall(spyCreateDirectory, 0, {
      args: [GIT_DIR],
    });

    assertSpyCalls(spyCreateDirectory, 2);

    spyCreateDirectory.restore();
  }
);

Deno.test(
  "shoul create a new object tracker directory in when the --init flag is passed and the repository does not exist",
  async () => {
    const mockFileSystem = new MockFileSystemService();

    const spyCreateDirectory = spy(mockFileSystem, "createDirectory");

    await init(mockFileSystem);

    assertSpyCalls(spyCreateDirectory, 2);
    assertSpyCall(spyCreateDirectory, 0, {
      args: [GIT_DIR],
    });

    assertSpyCall(spyCreateDirectory, 1, {
      args: [`${GIT_DIR}/objects`],
    });

    spyCreateDirectory.restore();
  }
);

Deno.test(
  "should log a message if Kiwi git directory already exists",
  async () => {
    const mockFileSystem = new MockFileSystemService();
    mockFileSystem.setExistingDirectory(GIT_DIR);

    const spyCreateDirectory = spy(mockFileSystem, "createDirectory");
    const spyConsoleLog = spy(console, "log");

    await init(mockFileSystem);

    assertSpyCalls(spyCreateDirectory, 1);
    assertSpyCall(spyCreateDirectory, 0, {
      args: [GIT_DIR],
    });

    assertSpyCalls(spyConsoleLog, 1);
    assertSpyCall(spyConsoleLog, 0, {
      args: ["Kiwi git repository already exists"],
    });

    spyCreateDirectory.restore();
    spyConsoleLog.restore();
  }
);
