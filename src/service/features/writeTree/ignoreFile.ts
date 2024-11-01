const ignoredFile = [".kiwi", "ignoredFile.ts"];

export const getIsIgnored = (entryName: string): boolean => {
    return ignoredFile.includes(entryName); // Check if entryName is in the ignored list
};
