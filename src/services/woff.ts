import { writeFile, access, mkdir } from "fs/promises";
import ttf2woff from "ttf2woff";
import ttf2woff2 from "ttf2woff2";
import { WOFF2_EXTENSION, WOFF_EXTENSION } from "./constants.js";

type WriteWoffArgument = {
  destinationFileName: string;
  buffer: Buffer;
  outDir?: string;
};
const createDirIfNotExists = async ({ outDir }: { outDir: string }) => {
  const outDirExists = await access(outDir)
    .then(() => true)
    .catch(() => false);
  if (!outDirExists) {
    await mkdir(outDir);
  }
};
export const writeWoff2 = async ({
  destinationFileName,
  buffer,
  outDir = "./results",
}: WriteWoffArgument) => {
  createDirIfNotExists({
    outDir,
  });
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
  outDir = "./results",
}: WriteWoffArgument) => {
  createDirIfNotExists({
    outDir,
  });
  const woffFileBuffer = ttf2woff(buffer);
  const woffFilePromise = writeFile(
    `${outDir}/${destinationFileName}.${WOFF_EXTENSION}`,
    woffFileBuffer
  );
  return woffFilePromise;
};
