import { assertSpyCall, assertSpyCalls, stub } from "@std/testing/mock";
// import { _internals } from "../adapter/fileSysteme/fileSystemeImplementation.ts"; // Import the module
import { init } from "../features/index.ts";

Deno.test(
  "should create a new Kiwi repository when the --init flag is passed and the repository does not exist",
  () => {
    const mkdirStub = stub(Deno, "mkdir");

    try {
      init(mkdirStub);
    } finally {
      mkdirStub.restore();
    }

    assertSpyCall(mkdirStub, 0, {
      args: [".kiwi"],
    });

    assertSpyCalls(mkdirStub, 1);
  }
);

Deno.test(
  "shouldn't create a new kiwi repository when the --init flag is passed and the repository exists",
  () => {
    const mkdirStub = stub(Deno, "mkdir");

    try {
      init(mkdirStub);
    } finally {
      mkdirStub.restore();
    }

    assertSpyCalls(mkdirStub, 0);
  }
);
