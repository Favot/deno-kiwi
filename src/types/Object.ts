export const object = {
    none: "NONE",
    blob: "blob",
    tree: "tree",
} as const;

export type ObjectType = (typeof object)[keyof typeof object];
