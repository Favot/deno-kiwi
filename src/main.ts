import { parseArguments, printHelp } from "./cli/index.ts";

function main(inputArgs: string[]): void {
  const args = parseArguments(inputArgs);
  console.log(args);

  if (args.help) {
    printHelp();
    Deno.exit(0);
  }
  const init = args.init;
  console.log(init);
  if (args.init) {
    console.log("Initializing Kiwi repository");
    Deno.exit(0);
  }
}

main(Deno.args);
