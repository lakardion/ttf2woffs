#!/usr/bin/env node
import { program } from "commander";
import { optimizeFont, optimizeFontsInFolder } from "./services/optimize.js";

const CURRENT_VERSION = "0.0.1";

program
  .name("ttf2woffs")
  .description("Optimize fonts from TTF to Woff/Woff2")
  .version(CURRENT_VERSION);

type ProgramOptions = {
  file?: string;
  folder?: string;
  woff?: boolean;
  woff2?: boolean;
  outDir?: string;
};
program
  .command("optimize")
  .description("Transform font from TTF to woff/2")
  .option("-fi, --file <string>", "The TTF file to optimize")
  .option("-fo, --folder <string>", "A folder with TTF files to optimize")
  .option("-w, --woff", "Whe to only create a woff file")
  .option("-w2, --woff2", "Whether to only create a woff2 file")
  .option(
    "-o, --outDir <string>",
    "The output directory of the optimized font files"
  )
  .action(async (str, cmd) => {
    const options = cmd?.opts() as ProgramOptions;
    const { woff, woff2, outDir } = options;
    const formats =
      woff || woff2
        ? {
            woff: Boolean(woff),
            woff2: Boolean(woff2),
          }
        : undefined;
    //TODO: Improve this with listr2 since we need to do file handling and the user will need to wait due to woff2
    if ("file" in options) {
      console.log("Processing file");
      await optimizeFont({
        formats,
        ttfFilePath: options.file,
        outDir,
      });
      console.log("Process finished");
      return;
    } else if ("folder" in options) {
      console.log("Processing folder files...");
      const result = await optimizeFontsInFolder({
        dir: options.folder,
        formats,
        outDir,
      });
      console.log("Process finished");
      return;
    }
    throw new Error("Should either pass a file or a folder path");
  });

program.parse();

//Sample -->
const myTTFFile = "Montserrat-VariableFont_wght";
// optimizeFont(`./test-fonts/${myTTFFile}.${TTF_EXTENSION}`);
