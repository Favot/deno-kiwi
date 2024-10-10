export const object = {
    none: "NONE",
    blob: "blob",
} as const;

export type ObjectType = (typeof object)[keyof typeof object];
