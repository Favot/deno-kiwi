import { assertEquals } from "@std/assert/equals";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";
import { RealFeaturesService } from "../RealFeatureService.ts";
import { readTree } from "./readTree.ts";

const workingDirectoryPath = "./working_directory/"; // Rename for clarity
const treeObjectId = "1234567890abcdef1234567890abcdef"; // Be more explicit in naming

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

Deno.test("readTree should fetch file OIDs and write them into the working directory", async () => {
    const mockFileSystem = createMockFileSystem();
    const mockFeatureService = createMockFeatureService();

    // Mock the expected tree structure returned by get_tree
    const mockTreeContent =
        "tree blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt\n" +
        "blob 960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325 file2.txt";

    const mockFileOneContent = `blob\x00This is a test file One.`;
    const mockFileTwoContent = `blob\x00This is a test file Two.`;

    setMockFileContent(mockFileSystem, mockTreeContent);
    setMockFileContent(
        mockFileSystem,
        mockFileOneContent,
        "4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704",
    );
    setMockFileContent(
        mockFileSystem,
        mockFileTwoContent,
        "960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325",
    );

    // Spy on the file writing to validate output
    const spyOnWriteFile = spy(mockFileSystem, "writeFile");

    // Call the readTree function under test
    await readTree(
        mockFileSystem,
        mockFeatureService,
        treeObjectId,
        workingDirectoryPath,
    );

    // Validate that the writeFile method was called twice
    assertSpyCalls(spyOnWriteFile, 2);

    const fileSystemState = mockFileSystem.getState();
    const createdFiles = Array.from(fileSystemState.files.entries());

    // Validate contents of the files in the working directory
    const fileOneEntry = createdFiles.find(([path]) =>
        path === `${workingDirectoryPath}file1.txt`
    );
    const fileTwoEntry = createdFiles.find(([path]) =>
        path === `${workingDirectoryPath}file2.txt`
    );

    if (!fileOneEntry || !fileTwoEntry) {
        throw new Error("File not found in working directory");
    }

    assertEquals(fileOneEntry[0], `${workingDirectoryPath}file1.txt`);
    assertEquals(fileOneEntry[1], "This is a test file One.");

    assertEquals(fileTwoEntry[0], `${workingDirectoryPath}file2.txt`);
    assertEquals(fileTwoEntry[1], "This is a test file Two.");
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

    const mockFileOneContent = `blob\x00This is a test file One.`;
    const mockFileTwoContent = `blob\x00This is a test file Two.`;
    const mockFileThreeContent = `blob\x00content file 3`; // Content for the file in subdir

    setMockFileContent(mockFileSystem, mockTreeContent);
    setMockFileContent(
        mockFileSystem,
        mockFileOneContent,
        "4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704",
    );
    setMockFileContent(
        mockFileSystem,
        mockSubTreeContent,
        "198c9e9aeb01c5cd973d81ce5f3353733e091c6248d497e562c7ae97b0b0a4a2",
    );

    setMockFileContent(
        mockFileSystem,
        mockFileTwoContent,
        "960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325",
    );
    setMockFileContent(
        mockFileSystem,
        mockFileThreeContent,
        "38d8a51ee51200de27f68923f919103f25050475f6dee8d2a43f467e5fc4cf7b",
    );

    await readTree(
        mockFileSystem,
        mockFeatureService,
        treeObjectId,
        workingDirectoryPath,
    );

    const fileSystemState = mockFileSystem.getState();
    const createdFiles = Array.from(fileSystemState.files.entries());

    const fileOneEntry = createdFiles.find(([path]) =>
        path === `${workingDirectoryPath}file1.txt`
    );
    const fileTwoEntry = createdFiles.find(([path]) =>
        path === `${workingDirectoryPath}file2.txt`
    );
    const fileThreeEntry = createdFiles.find(([path]) =>
        path === `${workingDirectoryPath}subdir/file3.txt`
    );

    if (!fileOneEntry || !fileTwoEntry || !fileThreeEntry) {
        throw new Error("File not found in working directory");
    }

    assertEquals(fileOneEntry[0], `${workingDirectoryPath}file1.txt`);
    assertEquals(fileOneEntry[1], "This is a test file One.");

    assertEquals(fileTwoEntry[0], `${workingDirectoryPath}file2.txt`);
    assertEquals(fileTwoEntry[1], "This is a test file Two.");

    assertEquals(fileThreeEntry[0], `${workingDirectoryPath}subdir/file3.txt`);
    assertEquals(fileThreeEntry[1], "content file 3");
});
