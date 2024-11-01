import { assertEquals } from "@std/assert/equals";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import {
    MockFileSystemService,
    testFileOne,
    testFileThree,
    testFileTwo,
} from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";
import { RealHashService } from "../../hash/RealHashService.ts";
import { RealFeaturesService } from "../RealFeatureService.ts";
import { writeTree } from "./index.ts";

const featureService = new RealFeaturesService();
const hashService = new RealHashService();
const mockFileSysteme = new MockFileSystemService();

Deno.test("Should scan the current directory and log the file ObjectId of each file when not ignored", async () => {
    mockFileSysteme.setTestProject();

    const spyOnLog = spy(console, "log");

    await writeTree(
        "./testDirectory",
        mockFileSysteme,
        featureService,
        hashService,
    );

    assertSpyCalls(spyOnLog, 3);

    assertSpyCall(spyOnLog, 0, {
        args: [`${testFileOne.objectId}`, `${testFileOne.path}`],
    });
    assertSpyCall(spyOnLog, 1, {
        args: [`${testFileTwo.objectId}`, `${testFileTwo.path}`],
    });

    assertSpyCall(spyOnLog, 2, {
        args: [`${testFileThree.objectId}`, `${testFileThree.path}`],
    });

    spyOnLog.restore();
    mockFileSysteme.restore();
});

Deno.test(
    "should scann the current directory and read each file",
    async () => {
        mockFileSysteme.setTestProject();

        const spyOnReadFile = spy(mockFileSysteme, "readFile");

        await writeTree(
            "./testDirectory",
            mockFileSysteme,
            featureService,
            hashService,
        );

        assertSpyCalls(spyOnReadFile, 3);

        mockFileSysteme.restore();
    },
);

Deno.test(
    "should register each file in the the database using is object id",
    async () => {
        mockFileSysteme.setTestProject();

        await writeTree(
            "./testDirectory",
            mockFileSysteme,
            featureService,
            hashService,
        );

        const fileSystemeState = mockFileSysteme.getState();

        const createdFiles = Array.from(fileSystemeState.files.entries());

        const fileOneDatabaseFile = createdFiles[3];

        assertEquals(
            fileOneDatabaseFile[0],
            `${OBJECTS_DIR_PATH}/${testFileOne.objectId}`,
        );
        assertEquals(fileOneDatabaseFile[1], "blob\x00file one content");

        const fileTwoDatabaseFile = createdFiles[4];
        assertEquals(
            fileTwoDatabaseFile[0],
            `${OBJECTS_DIR_PATH}/${testFileTwo.objectId}`,
        );
        assertEquals(fileTwoDatabaseFile[1], "blob\x00file two content");

        const fileThreeDatabaseFile = createdFiles[5];
        assertEquals(
            fileThreeDatabaseFile[0],
            `${OBJECTS_DIR_PATH}/${testFileThree.objectId}`,
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
            "tree\x00blob 03d831fc8587d8d871eae4a3417034bc3556d577a30f9b69be52ea48c463e347 fileOne.ts\nblob 8f266486ae7d7587ca09364b606d691fe250f6672ef8382f8e7166fa852feff1 fileTwo.ts\ntree 7a79c531c0c78b82d1f2cdeeb3a6ec8e9af96e7e977c85622910663e205846d4 subDirectory",
        );

        mockFileSysteme.restore();
    },
);
