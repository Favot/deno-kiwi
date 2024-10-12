const ignoredFile = [".kiwi"];

export const getIsFileIgnored = (entryName: string): boolean => {
    return ignoredFile.includes(entryName); // Check if entryName is in the ignored list
};
