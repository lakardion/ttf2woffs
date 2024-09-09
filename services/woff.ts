import { writeFile } from "fs/promises";
import ttf2woff from "ttf2woff";
import ttf2woff2 from "ttf2woff2";
import { WOFF2_EXTENSION, WOFF_EXTENSION } from "./constants.js";

type WriteWoffArgument = {
  destinationFileName: string;
  buffer: Buffer;
  outDir?: string;
};
export const writeWoff2 = ({
  destinationFileName,
  buffer,
  outDir = "./test-fonts",
}: WriteWoffArgument) => {
  const woff2FileBuffer = ttf2woff2(buffer);
  const woff2FilePromise = writeFile(
    `${outDir}/${destinationFileName}.${WOFF2_EXTENSION}`,
    woff2FileBuffer
  );
  return woff2FilePromise;
};

export const writeWoff = ({
  destinationFileName,
  buffer,
  outDir = "./test-fonts",
}: WriteWoffArgument) => {
  const woffFileBuffer = ttf2woff(buffer);
  const woffFilePromise = writeFile(
    `${outDir}/${destinationFileName}.${WOFF_EXTENSION}`,
    woffFileBuffer
  );
  return woffFilePromise;
};
