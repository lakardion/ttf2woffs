import { readFile, readdir } from "fs/promises";
import path from "path";
import { TTF_EXTENSION, WOFF2_EXTENSION, WOFF_EXTENSION } from "./constants.js";
import { writeWoff, writeWoff2 } from "./woff.js";

type FontFormatOption = {
  woff?: boolean;
  woff2?: boolean;
};

export const optimizeFont = async ({
  ttfFilePath,
  formats = {
    woff: true,
    woff2: true,
  },
  outDir,
}: {
  ttfFilePath: string;
  formats: FontFormatOption;
  outDir?: string;
}) => {
  const fileBuffer = await readFile(ttfFilePath);
  const pathDetails = path.parse(ttfFilePath);
  if (pathDetails.ext !== `.${TTF_EXTENSION}`) {
    throw new Error("Only TTF fonts are supported");
  }
  const writeWoffArgs = {
    buffer: fileBuffer,
    outDir,
    destinationFileName: pathDetails.name,
  };
  const woffFilePromise = formats.woff && writeWoff(writeWoffArgs);
  const woff2FilePromise = formats.woff2 && writeWoff2(writeWoffArgs);

  const woffPromisesArray = [
    ...(woffFilePromise
      ? [
          {
            format: WOFF_EXTENSION,
            promise: woffFilePromise,
          },
        ]
      : []),
    ...(woff2FilePromise
      ? [
          {
            format: WOFF2_EXTENSION,
            promise: woff2FilePromise,
          },
        ]
      : []),
  ];

  const conversionResult = await Promise.allSettled(
    woffPromisesArray.map((x) => x.promise)
  );

  for (const [idx, result] of conversionResult.entries()) {
    const current = woffPromisesArray[idx];
    if (result.status === "fulfilled") {
      console.log(
        `${pathDetails.name} - ✅ Convert to format ${current.format} successful`
      );
    }
    if (result.status === "rejected") {
      console.log(
        `${pathDetails.name} - ❌ Error when converting the file to format ${current.format}`,
        result.reason
      );
    }
  }
};

export const optimizeFontsInFolder = async ({
  dir,
  formats = {
    woff: true,
    woff2: true,
  },
  outDir,
}: {
  dir: string;
  formats: FontFormatOption;
  outDir?: string;
}) => {
  const dirFiles = await readdir(dir, { withFileTypes: true });
  const promises = dirFiles
    .filter((f) => {
      const isDirectory = f.isDirectory();
      isDirectory &&
        console.log(
          `🟡 ${f.name} is a directory so it won't be processed, ${f.isFile()}`
        );
      return !isDirectory;
    })
    .map((f) =>
      optimizeFont({
        ttfFilePath: `${dir}/${f.name}`,
        formats,
        outDir,
      })
    );
  return Promise.allSettled(promises);
};
