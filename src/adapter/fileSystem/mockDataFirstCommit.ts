import { OBJECTS_DIR_PATH } from "../../constants.ts";
export const TEST_DIRECTORY_PATH = "./testDirectory";

export type FileContent = {
    content: string;
    objectId: string;
    path: string;
};

type FileData = {
    name: string;
    content: string;
    objectId: string;
};

export const fileOneData: FileData = {
    name: "file1.txt",
    content: "This is a test file One.",
    objectId:
        "cc0d68fdc82a6841538b6976a52424d9cf55c0c70bb6bbadc074d64a498235d5",
};

export const testFileOne: FileContent = {
    path: `${TEST_DIRECTORY_PATH}/${fileOneData.name}`,
    objectId: fileOneData.objectId,
    content: fileOneData.content,
};

export const testFileOneDatabaseFile: FileContent = {
    path: `${OBJECTS_DIR_PATH}/${fileOneData.objectId}`,
    objectId: fileOneData.objectId,
    content: `blob\x00${fileOneData.content}`,
};

export const fileTwoData: FileData = {
    name: "file2.txt",
    content: "This is a test file Two.",
    objectId:
        "960bab35839f6a735c37493bc013066b608416c76be63a0577f4eb08b9112325",
};

export const testFileTwo: FileContent = {
    path: `${TEST_DIRECTORY_PATH}/${fileTwoData.name}`,
    objectId: fileTwoData.objectId,
    content: fileTwoData.content,
};

export const testFileTwoDatabaseFile: FileContent = {
    path: `${OBJECTS_DIR_PATH}/${fileTwoData.objectId}`,
    objectId: fileTwoData.objectId,
    content: `blob\x00${fileTwoData.content}`,
};

export const fileThreeData: FileData = {
    name: "file3.txt",
    content: "This is a test file Three.",
    objectId:
        "56b47f7cb4eee6624c4a1147f4b9805189588be1f30f554b54f1003066202832",
};

export const testFileThree: FileContent = {
    path: `${TEST_DIRECTORY_PATH}/subdir/${fileThreeData.name}`,
    objectId: fileThreeData.objectId,
    content: fileThreeData.content,
};

export const testFileThreeDatabaseFile: FileContent = {
    path: `${OBJECTS_DIR_PATH}/${fileThreeData.objectId}`,
    objectId: fileThreeData.objectId,
    content: `blob\x00${fileThreeData.content}`,
};

export const topTreeObjectId =
    "ed73c7d3c4e2ee1851913afb0559d076abc7c2bd126f78d8a40e3293431bd81b";

export const topTreeDatabaseFile: FileContent = {
    path: `${OBJECTS_DIR_PATH}/${topTreeObjectId}`,
    objectId: topTreeObjectId,
    content: `tree blob ${fileOneData.objectId} ${fileOneData.name}\n` +
        `blob ${fileTwoData.objectId} ${fileTwoData.name}\n` +
        `tree 8494d7c717f7bdc73a4cce8f96a42d7437e8f3670afbbe41fdbac7169057d6a9 subdir\n`,
};

const subTreeObjectId =
    "8494d7c717f7bdc73a4cce8f96a42d7437e8f3670afbbe41fdbac7169057d6a9";

export const subTreeDatabaseFile: FileContent = {
    path: `${OBJECTS_DIR_PATH}/${subTreeObjectId}`,
    objectId: subTreeObjectId,
    content: `tree blob ${fileThreeData.objectId} ${fileThreeData.name}\n`,
};

export const ignoredFile: FileContent = {
    path: `${TEST_DIRECTORY_PATH}/ignoredFile.ts`,
    content: "ignored file content",
    objectId: "ignoredFile",
};

export const DEFAULT_FILE_SYSTEME_VALUE = {
    fileContent: "test content",
    fileName: "test.txt",
};

export const commitFileObjectId =
    "70461a7ddb4deaf4a31776470677c69aad1ca68c7d553a1fc2ee90f45e541520";

export const mockCommitFile: FileContent = {
    path: `${OBJECTS_DIR_PATH}/${commitFileObjectId}`,
    objectId: commitFileObjectId,
    content: `tree\x00${topTreeObjectId}\n` +
        `\n` +
        `Commit message\n`,
};

export const headFileData: FileData = {
    name: "HEAD",
    content: commitFileObjectId,
    objectId: commitFileObjectId,
};

export const mockCommitFileWithHeadId =
    "d709361b9a2df555d5405aa3f88803f6e5976a0b554d738a06668a9fb62a32e5";

export const mockCommitFileWithHead: FileContent = {
    path: `${OBJECTS_DIR_PATH}/${mockCommitFileWithHeadId}`,
    objectId: mockCommitFileWithHeadId,
    content: `tree\x00${topTreeObjectId}\n` +
        `parent\x00${headFileData.content}\n` +
        `\n` +
        `Commit message\n`,
};
