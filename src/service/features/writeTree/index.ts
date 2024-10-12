import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import { getIsFileIgnored } from "./ignoreFile.ts";

export const writeTree = async (
    directory: string = ".",
    fileSystem: FileSystemService,
) => {
    for await (const entry of fileSystem.readDir(directory)) {
        const fullPath = `${directory}/${entry.name}`;

        if (getIsFileIgnored(entry.name)) {
            return;
        }
        if (entry.isFile) {
            console.log(fullPath);
        } else if (entry.isDirectory) {
            await writeTree(fullPath, fileSystem);
        }
    }
};
