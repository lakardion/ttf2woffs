import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ttf2woff from "ttf2woff";
import ttf2woff2 from "ttf2woff2";

const myTTFFile = "Montserrat-VariableFont_wght";
const TTF_EXTENSION = "ttf";
const WOFF_EXTENSION = "woff";
const WOFF2_EXTENSION = "woff2";

type WriteWoffArgument = {
  destinationFileName: string;
  buffer: Buffer;
};
const writeWoff2 = ({ destinationFileName, buffer }: WriteWoffArgument) => {
  const woff2FileBuffer = ttf2woff2(buffer);
  const woff2FilePromise = writeFile(
    `./test-fonts/${destinationFileName}.${WOFF2_EXTENSION}`,
    woff2FileBuffer
  );
  return woff2FilePromise;
};

const writeWoff = ({ destinationFileName, buffer }: WriteWoffArgument) => {
  const woffFileBuffer = ttf2woff(buffer);
  const woffFilePromise = writeFile(
    `./test-fonts/${destinationFileName}.${WOFF_EXTENSION}`,
    woffFileBuffer
  );
  return woffFilePromise;
};

const optimizeFont = async (ttfFilePath: string) => {
  const fileBuffer = await readFile(ttfFilePath);
  const pathDetails = path.parse(ttfFilePath);
  if (pathDetails.ext !== `.${TTF_EXTENSION}`) {
    throw new Error("Only TTF fonts are supported");
  }
  const writeWoffArgs = {
    buffer: fileBuffer,
    destinationFileName: pathDetails.name,
  };
  const woffFilePromise = writeWoff(writeWoffArgs);
  const woff2FilePromise = writeWoff2(writeWoffArgs);
  const woffPromisesArray = [
    {
      format: WOFF_EXTENSION,
      promise: woffFilePromise,
    },
    {
      format: WOFF2_EXTENSION,
      promise: woff2FilePromise,
    },
  ];

  const conversionResult = await Promise.allSettled(
    woffPromisesArray.map((x) => x.promise)
  );

  for (const [idx, result] of conversionResult.entries()) {
    const current = woffPromisesArray[idx];
    if (result.status === "fulfilled") {
      console.log(`✅ Convert to format ${current.format} successful`);
    }
    if (result.status === "rejected") {
      console.log(
        `❌ Error when converting the file to format ${current.format}`,
        result.reason
      );
    }
  }
};

//TODO: make this into a cli
// --file
// --folder -fo
// --woff -w
// --woff2 -w2
// --outDir -o
optimizeFont(`./test-fonts/${myTTFFile}.${TTF_EXTENSION}`);
