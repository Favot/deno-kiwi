import { assertSpyCalls, spy } from "@std/testing/mock";
import { main } from "../main.ts";
import { RealFeaturesService } from "../service/features/RealFeatureService.ts";

Deno.test("should call writeTree function when the --writeTree flag is passed", () => {
    const featureService = new RealFeaturesService();
    const spyOnWriteTree = spy(featureService, "writeTree");

    main({ inputArgs: ["--writeTree"], featureService });

    assertSpyCalls(spyOnWriteTree, 1);
});
