import { assert } from "@std/assert/assert";
import { MockFileSystemService } from "../../../adapter/fileSystem/MockFileSystemService.ts";
import type { ObjectType } from "../../../types/Object.ts";
import { RealFeaturesService } from "../RealFeatureService.ts";
import type { Entrie } from "../writeTree/index.ts";
import { iterTreeEntries } from "./iterTreeEntries.ts";

const createMockFileSystem = () => new MockFileSystemService();
const createMockFeatureService = () => new RealFeaturesService();

const verifyEntry = (
    entry: Entrie,
    expectedType: ObjectType,
    expectedName: string,
    expectedObjectId: string,
) => {
    assert(entry.type === expectedType);
    assert(entry.name === expectedName);
    assert(entry.objectId === expectedObjectId);
};

const objectId = "1234567890abcdef1234567890abcdef";

Deno.test("should return null if the objectId is missing", async () => {
    const mockFileSystem = createMockFileSystem();
    const mockFeatureService = createMockFeatureService();

    const entries = await iterTreeEntries(
        mockFileSystem,
        mockFeatureService,
    );

    assert(entries === null);
});

Deno.test("should return the correct entries when the objectId is provided", async () => {
    const mockFileSystem = createMockFileSystem();
    const mockFeatureService = createMockFeatureService();

    const fileContent =
        "tree blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt";

    mockFileSystem.setFileContent({ content: fileContent, objectId });

    const entries = await iterTreeEntries(
        mockFileSystem,
        mockFeatureService,
        objectId,
    );

    assert(entries !== null);
    assert(entries.length === 1);
    verifyEntry(
        entries[0],
        "blob",
        "file1.txt",
        "4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704",
    );

    mockFileSystem.restore();
});

Deno.test("should return the correct number of entries when the file contains multiple entries", async () => {
    const mockFileSystem = createMockFileSystem();
    const mockFeatureService = createMockFeatureService();

    const multipleEntriesContent =
        "tree blob 4b5c38392a132ecf986c17feee35e88dd34fb788a3231d780dbb3c049ef61704 file1.txt\n" +
        "blob 960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325 file2.txt\n" +
        "tree 198c9e9aeb01c5cd973d81ce5f3353733e091c6248d497e562c7ae97b0b0a4a2 subdir";

    mockFileSystem.setFileContent({
        content: multipleEntriesContent,
        objectId,
    });

    const entries = await iterTreeEntries(
        mockFileSystem,
        mockFeatureService,
        objectId,
    );

    assert(entries !== null);
    assert(entries.length === 3);

    mockFileSystem.restore();
});
