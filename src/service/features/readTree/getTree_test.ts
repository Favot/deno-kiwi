import { assert } from "@std/assert/assert";
import {
    fileOneData,
    fileThreeData,
    fileTwoData,
    testFileOneDatabaseFile,
    testFileThreeDatabaseFile,
    testFileTwoDatabaseFile,
    topTreeObjectId,
} from "../../../adapter/fileSystem/mockDataFirstCommit.ts";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { RealFeaturesService } from "../RealFeatureService.ts";
import { getTree } from "./getTree.ts";

const createMockFileSystem = () => new MockFileSystemService();
const createMockFeatureService = () => new RealFeaturesService();

Deno.test("getTree should correctly parse a tree structure with multiple entries with only blobs", async () => {
    const mockFileSystem = createMockFileSystem();
    const mockFeatureService = createMockFeatureService();

    const treeContent =
        "tree\x00blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt\n" +
        "blob 960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325 file2.txt";

    mockFileSystem.setFileContent({
        content: treeContent,
        objectId: topTreeObjectId,
    });

    const result = await getTree(
        mockFileSystem,
        mockFeatureService,
        topTreeObjectId,
    );

    assert(result !== null);
    assert(
        result["file1.txt"] ===
            "4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704",
    );
    assert(
        result["file2.txt"] ===
            "960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325",
    );

    mockFileSystem.restore();
});

Deno.test("getTree should correctly parse a tree structure with multiple entries with blobs and trees", async () => {
    const mockFileSystem = createMockFileSystem();
    const mockFeatureService = createMockFeatureService();

    mockFileSystem.setTestProjectWithDatabaseFiles();

    const result = await getTree(
        mockFileSystem,
        mockFeatureService,
        topTreeObjectId,
    );

    assert(result !== null);
    assert(
        result[fileOneData.name] ===
            testFileOneDatabaseFile.objectId,
    );
    assert(
        result[fileTwoData.name] ===
            testFileTwoDatabaseFile.objectId,
    );
    assert(
        result[`subdir/${fileThreeData.name}`] ===
            testFileThreeDatabaseFile.objectId,
    );

    mockFileSystem.restore();
});
