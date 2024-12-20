import { assertEquals } from "@std/assert/equals";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";
import { RealFeaturesService } from "../RealFeatureService.ts";
import { readTree } from "./readTree.ts";

const workingDirectoryPath = "./working_directory/";
const treeObjectId = "1234567890abcdef1234567890abcdef";

const createMockFileSystem = () => new MockFileSystemService();
const createMockFeatureService = () => new RealFeaturesService();

const setMockFileContent = (
    mockFileSystem: MockFileSystemService,
    content: string,
    objectId: string = treeObjectId,
) => {
    const filePath = `${OBJECTS_DIR_PATH}/${objectId}`;
    mockFileSystem.setFile(filePath, content);
    mockFileSystem.writeFile(filePath, new TextEncoder().encode(content));
};

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

Deno.test("readTree should fetch file OIDs and write them into the working directory", async () => {
    const mockFileSystem = createMockFileSystem();
    const mockFeatureService = createMockFeatureService();

    const mockTreeContent =
        "tree\x00blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt\n" +
        "blob 960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325 file2.txt";

    setMockFileContent(mockFileSystem, mockTreeContent);
    setMockFileContent(
        mockFileSystem,
        "blob\x00This is a test file One.",
        "4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704",
    );
    setMockFileContent(
        mockFileSystem,
        "blob\x00This is a test file Two.",
        "960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325",
    );

    const spyOnWriteFile = spy(mockFileSystem, "writeFile");

    await readTree(
        mockFileSystem,
        mockFeatureService,
        treeObjectId,
        workingDirectoryPath,
    );

    assertSpyCalls(spyOnWriteFile, 2);

    const fileSystemState = mockFileSystem.getState();
    const createdFiles = fileSystemState.files;

    // Validate contents of the files in the working directory
    assertFileExists(
        createdFiles,
        `${workingDirectoryPath}file1.txt`,
        "This is a test file One.",
    );
    assertFileExists(
        createdFiles,
        `${workingDirectoryPath}file2.txt`,
        "This is a test file Two.",
    );
});

Deno.test("readTree should fetch file OIDs and write files into the working directory with a subdirectory", async () => {
    const mockFileSystem = createMockFileSystem();
    const mockFeatureService = createMockFeatureService();

    const mockTreeContent =
        "tree\x00blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt\n" +
        "blob 960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325 file2.txt\n" +
        "tree 198c9e9aeb01c5cd973d81ce5f3353733e091c6248d497e562c7ae97b0b0a4a2 subdir";

    const mockSubTreeContent =
        "tree\x00blob 38d8a51ee51200de27f68923f919103f25050475f6dee8d2a43f467e5fc4cf7b file3.txt";

    setMockFileContent(mockFileSystem, mockTreeContent);
    setMockFileContent(
        mockFileSystem,
        "blob\x00This is a test file One.",
        "4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704",
    );
    setMockFileContent(
        mockFileSystem,
        mockSubTreeContent,
        "198c9e9aeb01c5cd973d81ce5f3353733e091c6248d497e562c7ae97b0b0a4a2",
    );

    setMockFileContent(
        mockFileSystem,
        "blob\x00This is a test file Two.",
        "960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325",
    );
    setMockFileContent(
        mockFileSystem,
        "blob\x00content file 3",
        "38d8a51ee51200de27f68923f919103f25050475f6dee8d2a43f467e5fc4cf7b",
    );

    await readTree(
        mockFileSystem,
        mockFeatureService,
        treeObjectId,
        workingDirectoryPath,
    );

    const fileSystemState = mockFileSystem.getState();
    const createdFiles = fileSystemState.files;

    assertFileExists(
        createdFiles,
        `${workingDirectoryPath}file1.txt`,
        "This is a test file One.",
    );
    assertFileExists(
        createdFiles,
        `${workingDirectoryPath}file2.txt`,
        "This is a test file Two.",
    );
    assertFileExists(
        createdFiles,
        `${workingDirectoryPath}subdir/file3.txt`,
        "content file 3",
    );
});
