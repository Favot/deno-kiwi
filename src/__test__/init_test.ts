import {
  assertSpyCall,
  assertSpyCalls,
  returnsNext,
  stub,
} from "@std/testing/mock";
import { _internals } from "../adapter/fileSysteme/directoryCreator.ts"; // Import the module
import { main } from "../main.ts";

Deno.test(
  "should create a new Kiwi repository when the --init flag is passed and the repository does not exist",
  () => {
    const randomIntStub = stub(
      _internals,
      "createDirectory",
      returnsNext([undefined])
    );

    try {
      main(["--init"]);
    } finally {
      // unwraps the randomInt method on the _internals object
      randomIntStub.restore();
    }

    // asserts that randomIntStub was called at least once and details about the first call.
    assertSpyCall(randomIntStub, 0, {
      args: [".kiwi"],
    });
    // asserts that randomIntStub was called at least twice and details about the second call.

    // asserts that randomIntStub was only called twice.
    assertSpyCalls(randomIntStub, 1);
  }
);

Deno.test(
  "should reinitialize an existing Kiwi repository when the --init flag is passed and the repository exists",
  () => {
    // TODO: Implement this test
  }
);
