import { assertEquals } from "@std/assert/equals";
import {
  KiwiCommand,
  parseKiwiCommandArguments,
} from "./parseKiwiCommandArguments.ts";

Deno.test("parseArguments - Commands with Arguments", () => {
  const cases = [
    {
      input: ["hash-object", "file-path"],
      expected: { command: KiwiCommand.HashObject, args: "file-path" },
    },
    {
      input: ["cat-file", "file-path"],
      expected: { command: KiwiCommand.CatFile, args: "file-path" },
    },
    {
      input: ["commit", "commit-message"],
      expected: { command: KiwiCommand.Commit, args: "commit-message" },
    },
    {
      input: ["read-tree", "file-path"],
      expected: { command: KiwiCommand.ReadTree, args: "file-path" },
    },
  ];

  for (const { input, expected } of cases) {
    const args = parseKiwiCommandArguments(input);
    assertEquals(args, expected);
  }

  // Test edge cases for missing arguments
  const errorCases = [
    {
      input: ["hash-object"],
      error: "Missing file path for hash-object command",
    },
    { input: ["cat-file"], error: "Missing file path for cat-file command" },
    { input: ["read-tree"], error: "Missing file path for read-tree command" },
    { input: ["commit"], error: "Missing commit message for commit command" },
  ];

  for (const { input, error: expectedError } of errorCases) {
    try {
      parseKiwiCommandArguments(input);
      throw new Error("Expected to throw error, but did not");
    } catch (err) {
      const error = err as Error;
      assertEquals(error.message, expectedError);
    }
  }
});

Deno.test("parseArguments - Commands without Arguments", () => {
  const cases = [
    { input: ["--help"], expected: { command: KiwiCommand.Help } },
    { input: ["init"], expected: { command: KiwiCommand.Init } },
    { input: ["write-tree"], expected: { command: KiwiCommand.WriteTree } },
  ];

  for (const { input, expected } of cases) {
    const args = parseKiwiCommandArguments(input);
    assertEquals(args, expected);
  }

  // Test unknown command
  try {
    parseKiwiCommandArguments(["unknown"]);
  } catch (err) {
    const error = err as Error;
    assertEquals(error.message, "Unknown command: unknown");
  }
});
