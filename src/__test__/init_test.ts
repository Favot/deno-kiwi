import { assertSpyCalls, spy } from "@std/testing/mock";
import { features } from "../features/index.ts";
import { main } from "../main.ts";

Deno.test(
  "should call the init function when the --init flag is passed",
  () => {
    const spyInit = spy(features, "init");

    main({ inputArgs: ["--init"] });

    assertSpyCalls(spyInit, 1);
    spyInit.restore();
  },
);
