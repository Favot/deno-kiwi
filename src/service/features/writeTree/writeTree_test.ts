import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";
import { RealHashService } from "../../hash/RealHashService.ts";
import { RealFeaturesService } from "../RealFeatureService.ts";
import { writeTree } from "./index.ts";

const featureService = new RealFeaturesService();
const hashService = new RealHashService();
const fileSysteme = new MockFileSystemService();

const fileOne = {
    path: "./testDirectory/fileOne.ts",
    content: "file one content",
    objectID:
        "03d831fc8587d8d871eae4a3417034bc3556d577a30f9b69be52ea48c463e347",
    databaseFileContnent: new TextEncoder().encode(
        "blob\x00file one content",
    ),
};

const fileTwo = {
    path: "./testDirectory/fileTwo.ts",
    content: "file two content",
    objectID:
        "8f266486ae7d7587ca09364b606d691fe250f6672ef8382f8e7166fa852feff1",
    databaseFileContnent: new TextEncoder().encode("blob\x00file two content"),
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
        featureService,
        hashService,
    );

    assertSpyCalls(spyOnLog, 2);

    assertSpyCall(spyOnLog, 0, {
        args: [`${fileOne.objectID}`, `${fileOne.path}`],
    });
    assertSpyCall(spyOnLog, 1, {
        args: [`${fileTwo.objectID}`, `${fileTwo.path}`],
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
        featureService,
        hashService,
    );

    assertSpyCalls(spyOnLog, 2);

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
        featureService,
        hashService,
    );

    assertSpyCalls(spyOnReadFile, 2);

    fileSysteme.restore();
});

Deno.test("should register each file in the the database using is object id", async () => {
    await fileSysteme.createDirectory("./testDirectory");

    fileSysteme.setFile(fileOne.path, fileOne.content);
    fileSysteme.setFile(fileTwo.path, fileTwo.content);
    fileSysteme.setFile(ignoreFile.path, ignoreFile.content);

    const spyOnWriteFile = spy(fileSysteme, "writeFile");

    await writeTree(
        "./testDirectory",
        fileSysteme,
        featureService,
        hashService,
    );

    assertSpyCalls(spyOnWriteFile, 2);

    assertSpyCall(spyOnWriteFile, 0, {
        args: [
            `${OBJECTS_DIR_PATH}/${fileOne.objectID}`,
            fileOne.databaseFileContnent,
        ],
    });

    assertSpyCall(spyOnWriteFile, 1, {
        args: [
            `${OBJECTS_DIR_PATH}/${fileTwo.objectID}`,
            fileTwo.databaseFileContnent,
        ],
    });

    fileSysteme.restore();
});
