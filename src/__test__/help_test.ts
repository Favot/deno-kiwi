import { assertSpyCalls, spy } from "@std/testing/mock";
import { main } from "../main.ts";
import { RealFeaturesService } from "../service/features/RealFeatureService.ts";

Deno.test(
  "should call the help function when the --help is passed",
  () => {
    const featureService = new RealFeaturesService();

    const spyHelpFunction = spy(featureService, "printHelp");

    main({ inputArgs: ["--help"], featureService });

    assertSpyCalls(spyHelpFunction, 1);
  },
);
