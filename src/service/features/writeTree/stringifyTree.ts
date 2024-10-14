import type { Tree } from "./index.ts";

export const stringifyEntry = (entry: Tree[]): string => {
    return entry.map((item) => `${item.type}\0${item.name}\0${item.objectId}`)
        .join("\n");
};
