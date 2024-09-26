import {
  assertSpyCall,
  assertSpyCalls,
  returnsNext,
  stub,
} from "@std/testing/mock";
import { _internals } from "../adapter/fileSysteme/fileSystemeImplementation.ts"; // Import the module
import { init } from "../features/index.ts";

Deno.test(
  "should create a new Kiwi repository when the --init flag is passed and the repository does not exist",
  () => {
    const fileSystemeImplementation = stub(
      _internals,
      "executeDirectoryCreation",
      returnsNext([undefined])
    );

    const mkdirStub = stub(Deno, "mkdir", returnsNext([]));

    try {
      init(mkdirStub);
    } finally {
      fileSystemeImplementation.restore();
      mkdirStub.restore();
    }

    assertSpyCall(fileSystemeImplementation, 0, {
      args: [".kiwi", mkdirStub],
    });

    assertSpyCalls(fileSystemeImplementation, 1);
  }
);

Deno.test(
  "should reinitialize an existing Kiwi repository when the --init flag is passed and the repository exists",
  () => {
    // TODO: Implement this test
  }
);
