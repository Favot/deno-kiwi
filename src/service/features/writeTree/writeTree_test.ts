import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { writeTree } from "./index.ts";

const fileSysteme = new MockFileSystemService();

const fileOne = {
    path: "./testDirectory/fileOne.ts",
    content: "file one content",
    objectID:
        "d0a9917b14e0ee75086e8b8056096b8191c29e4d459f37d721500273b671c42c",
};

const fileTwo = {
    path: "./testDirectory/fileTwo.ts",
    content: "file two content",
    objectID:
        "a568c2cf1a0e5e3d3701f518ca70e5dbe10451eacac141a4ac43e0141ce13aa0",
};

const ignoreFile = {
    path: "./testDirectory/.kiwi",
    content: "ignore content",
};

Deno.test("Should scan the current directory and log the file ObjectId of each file", async () => {
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
        args: [`${fileOne.content}`, `${fileOne.path}`],
    });
    assertSpyCall(spyOnLog, 1, {
        args: [`${fileTwo.content}`, `${fileTwo.path}`],
    });

    spyOnLog.restore();
    fileSysteme.restore();
});

Deno.test("should scan the current directory and not log the ignore files", async () => {
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
        args: [`${fileOne.content}`, `${fileOne.path}`],
    });
    assertSpyCall(spyOnLog, 1, {
        args: [`${fileTwo.content}`, `${fileTwo.path}`],
    });

    spyOnLog.restore();
    fileSysteme.restore();
});

Deno.test("should scann the current directory and open each file", async () => {
    await fileSysteme.createDirectory("./testDirectory");

    fileSysteme.setFile(fileOne.path, fileOne.content);
    fileSysteme.setFile(fileTwo.path, fileTwo.content);
    fileSysteme.setFile(ignoreFile.path, ignoreFile.content);

    const spyOnReadFile = spy(fileSysteme, "readFile");

    await writeTree(
        "./testDirectory",
        fileSysteme,
    );

    assertSpyCalls(spyOnReadFile, 2);

    fileSysteme.restore();
});
