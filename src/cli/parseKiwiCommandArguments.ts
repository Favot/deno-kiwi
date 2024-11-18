export enum KiwiCommand {
  Init,
  Help,
  HashObject,
  CatFile,
  WriteTree,
  ReadTree,
  Commit,
}

export type CommandWithArgument = {
  command:
    | KiwiCommand.HashObject
    | KiwiCommand.CatFile
    | KiwiCommand.Commit
    | KiwiCommand.ReadTree;
  args: string;
};

export type NoArgumentCommand = {
  command:
    | KiwiCommand.Init
    | KiwiCommand.Help
    | KiwiCommand.WriteTree;
};

// Combined return type
type ParsedCommand = CommandWithArgument | NoArgumentCommand;

export function parseKiwiCommandArguments(args: string[]): ParsedCommand {
  if (args.length === 0) {
    throw new Error("Missing command");
  }

  switch (args[0]) {
    case "init":
      return { command: KiwiCommand.Init };

    case "--help":
      return { command: KiwiCommand.Help };

    case "hash-object":
      if (!args[1]) {
        throw new Error("Missing file path for hash-object command");
      }

      return { command: KiwiCommand.HashObject, args: args[1] };

    case "cat-file":
      if (!args[1]) {
        throw new Error("Missing file path for cat-file command");
      }
      return { command: KiwiCommand.CatFile, args: args[1] };

    case "write-tree":
      return { command: KiwiCommand.WriteTree };

    case "read-tree":
      if (!args[1]) {
        throw new Error("Missing file path for read-tree command");
      }

      return { command: KiwiCommand.ReadTree, args: args[1] };

    case "commit":
      if (!args[1]) {
        throw new Error("Missing commit message for commit command");
      }
      return { command: KiwiCommand.Commit, args: args[1] };

    default:
      throw new Error(`Unknown command: ${args[0]}`);
  }
}
