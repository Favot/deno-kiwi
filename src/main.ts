import type { FileSystemService } from "./adapter/fileSystem/FileSystemService.ts";
import { RealFileSystemService } from "./adapter/fileSystem/RealFileSystemService.ts";
import {
  displayHelp,
  KiwiCommand,
  parseKiwiCommandArguments,
} from "./cli/index.ts";
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
  const hashObject = async (fileName: string) => {
    const fileContent = await fileSystemService.readFile(fileName);

    return await featureService.hashObject(
      fileContent,
      hashService,
      fileSystemService,
    );
  };

  const catFile = async (fileName: string) => {
    await featureService.catFile(
      fileName,
      fileSystemService,
      featureService,
    );
  };

  try {
    const args = parseKiwiCommandArguments(inputArgs);

    switch (args.command) {
      case KiwiCommand.Init:
        featureService.init(fileSystemService);
        break;
      case KiwiCommand.Help:
        featureService.printHelp();
        break;
      case KiwiCommand.HashObject:
        await hashObject(args.args);
        break;

      case KiwiCommand.CatFile:
        await catFile(args.args);
        break;

      case KiwiCommand.WriteTree:
        featureService.writeTree(
          "./",
          fileSystemService,
          featureService,
          hashService,
        );
        break;

      case KiwiCommand.ReadTree:
        featureService.readTree(
          fileSystemService,
          featureService,
          args.args,
          "./",
        );
        break;

      case KiwiCommand.Commit:
        featureService.commit(
          fileSystemService,
          featureService,
          hashService,
        );
        break;
    }
  } catch (error) {
    console.error(error);
    displayHelp();
  }
}

main({ inputArgs: Deno.args });
