const ignoredFileAndDirectory = [".kiwi"];

export const getIsFileIgnored = (entryName: string): boolean => {
    return ignoredFileAndDirectory.includes(entryName); // Check if entryName is in the ignored list
};
