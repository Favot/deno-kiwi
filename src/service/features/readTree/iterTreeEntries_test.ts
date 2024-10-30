import { assert } from "@std/assert/assert";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import { OBJECTS_DIR_PATH } from "../../../constants.ts";
import { RealFeaturesService } from "../RealFeatureService.ts";
import { iterTreeEntries } from "./iterTreeEntries.ts";

Deno.test("should return null if the objectId is missing", async () => {
    const mockFileSystem = new MockFileSystemService();
    const mockFeatureService = new RealFeaturesService();

    const entries = await iterTreeEntries(mockFileSystem, mockFeatureService);

    assert(entries === null);
});

Deno.test("should return the correct entries when the objectId is provided", async () => {
    const mockFileSystem = new MockFileSystemService();
    const mockFeatureService = new RealFeaturesService();

    mockFileSystem.setFile(
        `${OBJECTS_DIR_PATH}/1234567890abcdef1234567890abcdef`,
        "tree blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt",
    );

    mockFileSystem.writeFile(
        `${OBJECTS_DIR_PATH}/1234567890abcdef1234567890abcdef`,
        new TextEncoder().encode(
            "tree blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt",
        ),
    );

    const entries = await iterTreeEntries(
        mockFileSystem,
        mockFeatureService,
        "1234567890abcdef1234567890abcdef",
    );

    assert(entries !== null);

    assert(entries.length === 1);

    assert(entries[0].type === "blob");
    assert(entries[0].name === "file1.txt");
    assert(
        entries[0].objectId ===
            "4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704",
    );

    mockFileSystem.restore();
});

Deno.test("should return the correct number of entries when the file contains multiple entries", async () => {
    const mockFileSystem = new MockFileSystemService();
    const mockFeatureService = new RealFeaturesService();

    mockFileSystem.setFile(
        `${OBJECTS_DIR_PATH}/1234567890abcdef1234567890abcdef`,
        "tree blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt\nblob 960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325 file2.txt\ntree 198c9e9aeb01c5cd973d81ce5f3353733e091c6248d497e562c7ae97b0b0a4a2 subdir",
    );

    mockFileSystem.writeFile(
        `${OBJECTS_DIR_PATH}/1234567890abcdef1234567890abcdef`,
        new TextEncoder().encode(
            "tree blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt\nblob 960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325 file2.txt\ntree 198c9e9aeb01c5cd973d81ce5f3353733e091c6248d497e562c7ae97b0b0a4a2 subdir",
        ),
    );

    const entries = await iterTreeEntries(
        mockFileSystem,
        mockFeatureService,
        "1234567890abcdef1234567890abcdef",
    );

    assert(entries !== null);

    assert(entries.length === 3);

    mockFileSystem.restore();
});
