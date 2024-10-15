import { assertEquals } from "@std/assert/equals";
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

const fileThree = {
    path: "./testDirectory/subDirectory/fileThree.ts",
    content: "file three content",
    objectID:
        "381f18f987f1c0e3c7d6e53350baab46067ca2a665a814f249351c0c3caa360c",
    databaseFileContnent: new TextEncoder().encode(
        "blob\x00file three content",
    ),
};

const ignoreFile = {
    path: "./testDirectory/.kiwi",
    content: "ignore content",
};

Deno.test("Should scan the current directory and log the file ObjectId of each file", async () => {
    await fileSysteme.createDirectory("./testDirectory");
    await fileSysteme.createDirectory("./testDirectory/subDirectory");

    fileSysteme.setFile(fileOne.path, fileOne.content);
    fileSysteme.setFile(fileTwo.path, fileTwo.content);
    fileSysteme.setFile(fileThree.path, fileThree.content);

    const spyOnLog = spy(console, "log");

    await writeTree(
        "./testDirectory",
        fileSysteme,
        featureService,
        hashService,
    );

    assertSpyCalls(spyOnLog, 3);

    assertSpyCall(spyOnLog, 0, {
        args: [`${fileOne.objectID}`, `${fileOne.path}`],
    });
    assertSpyCall(spyOnLog, 1, {
        args: [`${fileTwo.objectID}`, `${fileTwo.path}`],
    });

    assertSpyCall(spyOnLog, 2, {
        args: [`${fileThree.objectID}`, `${fileThree.path}`],
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

Deno.test(
    "should scann the current directory and open each file",
    async () => {
        await fileSysteme.createDirectory("./testDirectory");
        await fileSysteme.createDirectory("./testDirectory/subDirectory");

        fileSysteme.setFile(fileOne.path, fileOne.content);
        fileSysteme.setFile(fileTwo.path, fileTwo.content);
        fileSysteme.setFile(fileThree.path, fileThree.content);

        fileSysteme.setFile(ignoreFile.path, ignoreFile.content);

        const spyOnReadFile = spy(fileSysteme, "readFile");

        await writeTree(
            "./testDirectory",
            fileSysteme,
            featureService,
            hashService,
        );

        assertSpyCalls(spyOnReadFile, 3);

        fileSysteme.restore();
    },
);

Deno.test.only(
    "should register each file in the the database using is object id",
    async () => {
        await fileSysteme.createDirectory("./testDirectory");
        await fileSysteme.createDirectory("./testDirectory/subDirectory");
        await fileSysteme.createDirectory("./.kiwi");
        await fileSysteme.createDirectory("./.kiwi/objects");
        fileSysteme.setFile(fileOne.path, fileOne.content);
        fileSysteme.writeFile(
            fileOne.path,
            new TextEncoder().encode(fileOne.content),
        );
        fileSysteme.setFile(fileTwo.path, fileTwo.content);
        fileSysteme.writeFile(
            fileTwo.path,
            new TextEncoder().encode(fileTwo.content),
        );
        fileSysteme.setFile(fileThree.path, fileThree.content);
        fileSysteme.writeFile(
            fileThree.path,
            new TextEncoder().encode(fileThree.content),
        );
        fileSysteme.setFile(ignoreFile.path, ignoreFile.content);

        await writeTree(
            "./testDirectory",
            fileSysteme,
            featureService,
            hashService,
        );

        const state = fileSysteme.getState();

        const createdFiles = Array.from(state.files.entries());

        assertEquals(createdFiles.length, 8);

        const fileOneDatabaseFile = createdFiles[3];

        assertEquals(
            fileOneDatabaseFile[0],
            `${OBJECTS_DIR_PATH}/${fileOne.objectID}`,
        );
        assertEquals(fileOneDatabaseFile[1], "blob\x00file one content");

        const fileTwoDatabaseFile = createdFiles[4];
        assertEquals(
            fileTwoDatabaseFile[0],
            `${OBJECTS_DIR_PATH}/${fileTwo.objectID}`,
        );
        assertEquals(fileTwoDatabaseFile[1], "blob\x00file two content");

        const fileThreeDatabaseFile = createdFiles[5];
        assertEquals(
            fileThreeDatabaseFile[0],
            `${OBJECTS_DIR_PATH}/${fileThree.objectID}`,
        );
        assertEquals(fileThreeDatabaseFile[1], "blob\x00file three content");

        const subDirectoryFileDatabaseFile = createdFiles[6];
        assertEquals(
            subDirectoryFileDatabaseFile[0],
            `${OBJECTS_DIR_PATH}/7a79c531c0c78b82d1f2cdeeb3a6ec8e9af96e7e977c85622910663e205846d4`,
        );
        assertEquals(
            subDirectoryFileDatabaseFile[1],
            "tree\x00blob 381f18f987f1c0e3c7d6e53350baab46067ca2a665a814f249351c0c3caa360c fileThree.ts",
        );

        const directoryDatabaseFile = createdFiles[7];
        assertEquals(
            directoryDatabaseFile[0],
            `${OBJECTS_DIR_PATH}/2e055794984acc72ad1616f22ad026a0576fea808cfc7906181e3a8c28409bb1`,
        );
        assertEquals(
            directoryDatabaseFile[1],
            "tree blob 03d831fc8587d8d871eae4a3417034bc3556d577a30f9b69be52ea48c463e347 fileOne.ts\nblob 8f266486ae7d7587ca09364b606d691fe250f6672ef8382f8e7166fa852feff1 fileTwo.ts\ntree 7a79c531c0c78b82d1f2cdeeb3a6ec8e9af96e7e977c85622910663e205846d4 subDirectory",
        );

        fileSysteme.restore();
    },
);
