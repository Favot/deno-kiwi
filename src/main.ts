import type { FileSystemService } from "./adapter/fileSystem/FileSystemService.ts";
import { RealFileSystemService } from "./adapter/fileSystem/RealFileSystemService.ts";
import { parseArguments } from "./cli/index.ts";
import type { FeaturesService } from "./service/features/FeaturesService.ts";
import { RealFeaturesService } from "./service/features/RealFeatureService.ts";
import type { HashService } from "./service/hash/HashService.ts";
import { RealHashService } from "./service/hash/RealHashService.ts";

export async function main({
  inputArgs,
  featureService = new RealFeaturesService(),
  fileSystemService = new RealFileSystemService(),
  hashService = new RealHashService(),
}: {
  inputArgs: string[];
  featureService?: FeaturesService;
  fileSystemService?: FileSystemService;
  hashService?: HashService;
}): Promise<void | string> {
  const args = parseArguments(inputArgs);

  if (args.help) {
    featureService.printHelp();
  }

  if (args.init) {
    console.log("init");
    featureService.init(fileSystemService);
  }

  if (args.hashObject) {
    if (!args.hashObject.length) {
      return console.error("Missing file path for --hashObject flag");
    }

    return await featureService.hashObject(
      args.hashObject,
      hashService,
      fileSystemService,
    );
  }
}

main({ inputArgs: Deno.args });
