import { assertEquals } from "@std/assert/equals";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import {
    MockFileSystemService,
    subTreeDatabaseFile,
    testDirectoryPath,
    testFileOne,
    testFileOneDatabaseFile,
    testFileThree,
    testFileThreeDatabaseFile,
    testFileTwo,
    testFileTwoDatabaseFile,
    topTreeDatabaseFile,
} from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";
import { RealHashService } from "../../hash/RealHashService.ts";
import { RealFeaturesService } from "../RealFeatureService.ts";
import { writeTree } from "./index.ts";

const featureService = new RealFeaturesService();
const hashService = new RealHashService();
const mockFileSysteme = new MockFileSystemService();

function assertFileExists(
    files: Map<string, string>,
    expectedPath: string,
    expectedContent: string,
) {
    const fileEntry = files.get(expectedPath);
    if (!fileEntry || fileEntry !== expectedContent) {
        throw new Error(`File not found or content mismatch: ${expectedPath}`);
    }
    assertEquals(fileEntry, expectedContent);
}

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
            testDirectoryPath,
            mockFileSysteme,
            featureService,
            hashService,
        );

        const fileSystemState = mockFileSysteme.getState();

        const createdFiles = fileSystemState.files;

        assertFileExists(
            createdFiles,
            `${OBJECTS_DIR_PATH}/${testFileOne.objectId}`,
            `${testFileOneDatabaseFile.content}`,
        );

        assertFileExists(
            createdFiles,
            `${OBJECTS_DIR_PATH}/${testFileTwo.objectId}`,
            `${testFileTwoDatabaseFile.content}`,
        );

        assertFileExists(
            createdFiles,
            `${OBJECTS_DIR_PATH}/${testFileThree.objectId}`,
            `${testFileThreeDatabaseFile.content}`,
        );

        assertFileExists(
            createdFiles,
            `${subTreeDatabaseFile.path}`,
            `${subTreeDatabaseFile.content}`,
        );

        assertFileExists(
            createdFiles,
            `${topTreeDatabaseFile.path}`,
            `${topTreeDatabaseFile.content}`,
        );

        mockFileSysteme.restore();
    },
);
