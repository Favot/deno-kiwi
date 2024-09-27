import { assertSpyCall, assertSpyCalls, stub } from "@std/testing/mock";
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
