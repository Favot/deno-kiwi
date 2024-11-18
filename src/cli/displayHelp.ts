export const displayHelp = () => {
    console.log(`Usage: kiwi [OPTIONS...]`);
    console.log("\nOptional flags:");
    console.log("  -h, --help                Display this help and exit");
    console.log(
        "  --init                    Create a empty Kiwi respository or reinsitialize an existing one",
    );
    console.log("  --hash-object            Hash an object");
    console.log("  --cat-file               Read the content of a file");
    console.log("  --commit                 Commit changes");
    console.log("  --read-tree              Read the content of a tree");
    console.log("  --write-tree             Write a tree");
};
