import { assert } from "@std/assert/assert";
import {
    MockFileSystemService,
    testDirectoryPath,
    testFileOne,
    testFileThree,
    testFileTwo,
} from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { emptyCurrentDirectory } from "./emptyCurrentDirectory.ts";

Deno.test("should empty the current directory except the ignored files and directories", async () => {
    const mockFileSystem = new MockFileSystemService();
    mockFileSystem.setTestProject();

    await emptyCurrentDirectory(mockFileSystem, "./testDirectory");

    const { files: createdFiles, directories: directoryEntries } =
        mockFileSystem.getState();

    assertFileExists(
        createdFiles,
        `${testDirectoryPath}/ignoredFile.ts`,
        "ignored file content",
    );

    assertFileNotExists(createdFiles, testFileOne.path);
    assertFileNotExists(createdFiles, testFileTwo.path);
    assertFileNotExists(createdFiles, testFileThree.path);

    assertDirectoryNotExists(
        directoryEntries,
        "./testDirectory/testDirectory/subDirectory",
    );

    mockFileSystem.restore();
});

function assertFileExists(
    files: Map<string, string>,
    filePath: string,
    expectedContent: string,
) {
    const entry = files.get(filePath);
    if (!entry || entry !== expectedContent) {
        throw new Error(`File not found or content mismatch: ${filePath}`);
    }
    assert(entry === expectedContent);
}

function assertFileNotExists(files: Map<string, string>, filePath: string) {
    if (files.has(filePath)) {
        throw new Error(`File found in current directory: ${filePath}`);
    }
    assert(!files.has(filePath));
}

function assertDirectoryNotExists(directories: Set<string>, dirPath: string) {
    if (directories.has(dirPath)) {
        throw new Error(`Directory found in current directory: ${dirPath}`);
    }
    assert(!directories.has(dirPath));
}
