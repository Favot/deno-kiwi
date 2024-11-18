import { assertSpyCalls, spy } from "@std/testing/mock";
import { main } from "../main.ts";
import { RealFeaturesService } from "../service/features/RealFeatureService.ts";

Deno.test(
  "should call the init function when the --init flag is passed",
  () => {
    const featureService = new RealFeaturesService();
    const spyInit = spy(featureService, "init");

    main({ inputArgs: ["init"], featureService });

    assertSpyCalls(spyInit, 1);
    spyInit.restore();
  },
);
