import { parseArguments } from "./cli/index.ts";
import { init, printHelp } from "./features/index.ts";

export function main(inputArgs: string[]): void {
  const args = parseArguments(inputArgs);

  if (args.help) {
    printHelp();
  }

  if (args.init) {
    init(Deno.mkdir);
  }
}

main(Deno.args);
