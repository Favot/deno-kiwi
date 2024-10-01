import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../adapter/fileSysteme/fileSystemeImplementation_test.ts";
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
  }
);
