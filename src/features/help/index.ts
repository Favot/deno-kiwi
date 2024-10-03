export function printHelp(): void {
  console.log(`Usage: kiwi [OPTIONS...]`);
  console.log("\nOptional flags:");
  console.log("  -h, --help                Display this help and exit");
  console.log(
    "  --init                    Create a empty Kiwi respository or reinsitialize an existing one"
  );
  console.log("  --hash-object            Hash an object");
}
