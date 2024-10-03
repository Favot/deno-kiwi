import type { FileSystemService } from "./adapter/fileSystem/FileSystemService.ts";
import { RealFileSystemService } from "./adapter/fileSystem/RealFileSystemService.ts";
import { parseArguments } from "./cli/index.ts";
import { hashFile } from "./features/hashObject/hashObject.ts";
import { features } from "./features/index.ts";
import type { HashService } from "./service/hash/HashService.ts";
import { RealHashService } from "./service/hash/RealHashService.ts";

export function main({
  inputArgs,
  fileSystemService = new RealFileSystemService(),
  hashService = new RealHashService(),
}: {
  inputArgs: string[];
  fileSystemService?: FileSystemService;
  hashService?: HashService;
}): void {
  const args = parseArguments(inputArgs);

  if (args.help) {
    features.printHelp();
  }

  if (args.init) {
    console.log("init");
    features.init(fileSystemService);
  }

  if (args.hashObject) {
    if (!args.hashObject.length) {
      return console.error("Missing file path for --hashObject flag");
    }

    hashFile(args.hashObject, hashService, fileSystemService);
  }
}

main({ inputArgs: Deno.args });
