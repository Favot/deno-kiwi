import type { Entrie } from "./index.ts";

export const stringifyEntry = (entries: Entrie[]): string => {
    return entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ type, objectId, name }) => `${type}\x00${objectId} ${name}`)
        .join("\n");
};
