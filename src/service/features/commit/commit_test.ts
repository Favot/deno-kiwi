import { assert } from "@std/assert/assert";
import { assertEquals } from "@std/assert/equals";
import {
    commitFileObjectId,
    headFileData,
    mockCommitFile,
    mockCommitFileWithHead,
    mockCommitFileWithHeadId,
    TEST_DIRECTORY_PATH,
} from "../../../adapter/fileSystem/mockData.ts";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { GIT_DIR } from "../../../constants.ts";
import { RealHashService } from "../../hash/RealHashService.ts";
import { RealFeaturesService } from "../RealFeatureService.ts";
import { commit } from "./commit.ts";

Deno.test("should create a commit file with the commit message", async () => {
    const hashService = new RealHashService();
    const mockFeatureService = new RealFeaturesService();

    const mockFileSystem = new MockFileSystemService();

    mockFileSystem.setTestProject();

    const commitMessage = "Commit message";
    const commitId = await commit(
        mockFileSystem,
        mockFeatureService,
        hashService,
        commitMessage,
        TEST_DIRECTORY_PATH,
    );

    assertEquals(commitId, commitFileObjectId);

    const fileSystemState = mockFileSystem.getState();

    assertFileExists(
        fileSystemState.files,
        mockCommitFile.path,
        mockCommitFile.content,
    );
});

Deno.test("Should set the HAD to the commit object id", async () => {
    const hashService = new RealHashService();
    const mockFeatureService = new RealFeaturesService();

    const mockFileSystem = new MockFileSystemService();

    mockFileSystem.setTestProject();

    const commitMessage = "Commit message";
    await commit(
        mockFileSystem,
        mockFeatureService,
        hashService,
        commitMessage,
        TEST_DIRECTORY_PATH,
    );

    const fileSystemState = mockFileSystem.getState();

    assertFileExists(
        fileSystemState.files,
        `${GIT_DIR}/${headFileData.name}`,
        headFileData.content,
    );
});

Deno.test("Should had the Head id in the commit file when the commit function is called", async () => {
    const hashService = new RealHashService();
    const mockFeatureService = new RealFeaturesService();

    const mockFileSystem = new MockFileSystemService();

    mockFileSystem.setTestProject();
    mockFileSystem.setFile(
        `${GIT_DIR}/${headFileData.name}`,
        headFileData.content,
    );

    const commitMessage = "Commit message";
    const commitId = await commit(
        mockFileSystem,
        mockFeatureService,
        hashService,
        commitMessage,
        TEST_DIRECTORY_PATH,
    );

    assertEquals(commitId, mockCommitFileWithHeadId);

    const fileSystemState = mockFileSystem.getState();

    assertFileExists(
        fileSystemState.files,
        mockCommitFileWithHead.path,
        mockCommitFileWithHead.content,
    );
});

function assertFileExists(
    files: Map<string, string>,
    filePath: string,
    expectedContent: string,
) {
    const entry = files.get(filePath);

    if (!entry) {
        throw new Error(`File not found: ${filePath}`);
    }

    if (entry !== expectedContent) {
        throw new Error(
            `File content mismatch:\n Expected: ${expectedContent}\n Got: ${entry}`,
        );
    }

    assert(entry === expectedContent);
}
