import { hashFile } from "./hashObject/hashObject.ts";
import { printHelp } from "./help/index.ts";
import { init } from "./init/index.ts";

export const features = {
  init,
  printHelp,
  hashFile,
};
