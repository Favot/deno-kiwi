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
    content: "This is a test file One. Second commit",
    objectId:
        "b0c56947aeccd5a8df0d8f4452239c5a32d81244f9c58a5997adcab66e22a2c3",
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
    content: "This is a test file Two. Second commit",
    objectId:
        "a11d72ba9312db6849f1277cb2954b47faa9da1f82c4b223baabb06985b33259",
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
    content: "This is a test file Three. Second commit",
    objectId:
        "ce00cadb21f738936031b035c599334662c9fc26ce8c23d9bdea36bf607f0c8f",
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
    "fead7d38757c223466f8092a2bd803c1877227756ce233df809e531f62e60fe9";

export const topTreeDatabaseFile: FileContent = {
    path: `${OBJECTS_DIR_PATH}/${topTreeObjectId}`,
    objectId: topTreeObjectId,
    content: `tree blob ${fileOneData.objectId} ${fileOneData.name}\n` +
        `blob ${fileTwoData.objectId} ${fileTwoData.name}\n` +
        `tree 8494d7c717f7bdc73a4cce8f96a42d7437e8f3670afbbe41fdbac7169057d6a9 subdir\n`,
};

const subTreeObjectId =
    "41fb8c97a632b804a90b771b0578152f14276255db77fc4b51ed2694f0417304";

export const subTreeDatabaseFile: FileContent = {
    path: `${OBJECTS_DIR_PATH}/${subTreeObjectId}`,
    objectId: subTreeObjectId,
    content: `tree blob ${fileThreeData.objectId} ${fileThreeData.name}\n`,
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
