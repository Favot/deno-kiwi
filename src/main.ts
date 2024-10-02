import { RealFileSystemService } from "./adapter/fileSystem/RealFileSystemService.ts";
import { parseArguments } from "./cli/index.ts";
import { init, printHelp } from "./features/index.ts";

export function main(inputArgs: string[]): void {
  const args = parseArguments(inputArgs);

  if (args.help) {
    printHelp();
  }

  if (args.init) {
    const fileSystemService = new RealFileSystemService();
    init(fileSystemService);
  }

  if (args["hash-object"]) {
    console.log("hash-object");
  }
}

main(Deno.args);
