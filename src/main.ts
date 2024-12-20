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

    const fileContent = await fileSystemService.readFile(args.hashObject);

    return await featureService.hashObject(
      fileContent,
      hashService,
      fileSystemService,
    );
  }

  if (args.catFile) {
    if (!args.catFile.length) {
      return console.error("Missing file path for --catFile flag");
    }

    return await featureService.catFile(
      args.catFile,
      fileSystemService,
      featureService,
    );
  }

  if (args.writeTree) {
    featureService.writeTree(
      "./",
      fileSystemService,
      featureService,
      hashService,
    );
  }

  if (args.readTree) {
    featureService.readTree(
      fileSystemService,
      featureService,
      args.readTree,
      "./",
    );
  }

  if (args.commit) {
    featureService.commit(
      fileSystemService,
      featureService,
      hashService,
    );
  }
}

main({ inputArgs: Deno.args });
