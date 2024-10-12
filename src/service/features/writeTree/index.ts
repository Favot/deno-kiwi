import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";

export const writeTree = async (
    directory: string = ".",
    fileSystem: FileSystemService,
) => {
    for await (const entry of fileSystem.readDir(directory)) {
        const fullPath = `${directory}/${entry.name}`;
        if (entry.isFile) {
            console.log(fullPath);
        } else if (entry.isDirectory) {
            await writeTree(fullPath, fileSystem);
        }
    }
};

const ignoredFileAndDirectory = [".kiwi"];

export const getIsFileIgnored = (entryName): boolean => {
    return ignoredFileAndDirectory.forEach((ignored) =>
        entryName === ignored ? true : false
    );
};
