import { type Args, parse } from "https://deno.land/std@0.200.0/flags/mod.ts";

export function parseArguments(args: string[]): Args {
  const booleanArgs = ["help", "init"];

  // All string arguments
  const stringArgs = ["hash-object"];

  // And a list of aliases
  const alias = {
    help: "h",
  };

  return parse(args, {
    alias,
    boolean: booleanArgs,
    string: stringArgs,
    stopEarly: false,
    "--": true,
  });
}
