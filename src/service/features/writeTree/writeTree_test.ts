import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { writeTree } from "./index.ts";

Deno.test("Should scan the current directory and log the file path of each file", async () => {
    const fileSysteme = new MockFileSystemService();

    const fileOne = {
        path: "./testDirectory/fileOne.ts",
        content: "file one content",
    };

    const fileTwo = {
        path: "./testDirectory/fileTwo.ts",
        content: "file two content",
    };

    await fileSysteme.createDirectory("./testDirectory");

    fileSysteme.setFile(fileOne.path, fileOne.content);
    fileSysteme.setFile(fileTwo.path, fileTwo.content);

    const spyOnLog = spy(console, "log");

    await writeTree(
        "./testDirectory",
        fileSysteme,
    );

    assertSpyCalls(spyOnLog, 2);

    assertSpyCall(spyOnLog, 0, {
        args: [`${fileOne.path}`],
    });
    assertSpyCall(spyOnLog, 1, {
        args: [`${fileTwo.path}`],
    });

    spyOnLog.restore();
});

Deno.test("should scan the current directory and not log the ignore files", async () => {
    const fileSysteme = new MockFileSystemService();

    const fileOne = {
        path: "./testDirectory/fileOne.ts",
        content: "file one content",
    };

    const fileTwo = {
        path: "./testDirectory/fileTwo.ts",
        content: "file two content",
    };

    const ignoreFile = {
        path: "./testDirectory/.kiwi",
        content: "ignore content",
    };

    await fileSysteme.createDirectory("./testDirectory");

    fileSysteme.setFile(fileOne.path, fileOne.content);
    fileSysteme.setFile(fileTwo.path, fileTwo.content);
    fileSysteme.setFile(ignoreFile.path, ignoreFile.content);

    const spyOnLog = spy(console, "log");

    await writeTree(
        "./testDirectory",
        fileSysteme,
    );

    assertSpyCalls(spyOnLog, 2);

    assertSpyCall(spyOnLog, 0, {
        args: [`${fileOne.path}`],
    });
    assertSpyCall(spyOnLog, 1, {
        args: [`${fileTwo.path}`],
    });

    spyOnLog.restore();
});
