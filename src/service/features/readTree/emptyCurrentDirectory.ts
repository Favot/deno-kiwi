import type { FileSystemService } from "../../../adapter/fileSystem/FileSystemService.ts";
import { getIsIgnored } from "../writeTree/ignoreFile.ts";

export const emptyCurrentDirectory = async (
    fileSystem: FileSystemService,
    directory = ".",
) => {
    for await (const entry of fileSystem.readDir(directory)) {
        const currentPath = `${directory}/${entry.name}`;

        if (getIsIgnored(entry.name)) {
            continue;
        }

        if (entry.isFile) {
            await fileSystem.deleteFile(currentPath);
        } else if (entry.isDirectory) {
            await emptyCurrentDirectory(fileSystem, currentPath);
        }
    }

    const entries = [];
    for await (const entry of fileSystem.readDir(directory)) {
        entries.push(entry);
    }

    const isEmpty = !entries.some((entry) => !getIsIgnored(entry.name));

    if (isEmpty) {
        await deleteDirectory(directory, fileSystem);
    }
};

async function deleteDirectory(
    directory: string,
    fileSystem: FileSystemService,
) {
    try {
        await fileSystem.remove(directory);
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            console.error(`Directory not found: ${directory}`);
        } else {
            console.error(`Failed to delete directory: ${directory}`);
        }
    }
}
