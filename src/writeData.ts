import { getDebugPrefix } from "./getDebugPrefix";
import fs from "fs";
import cheese from "cheese-log";

export const writeData = (
  identifier: string,
  media: any,
  mediaTargetPath: string,
): boolean => {
  const debugPrefix = getDebugPrefix("writeData()", identifier);

  try {
    fs.writeFileSync(mediaTargetPath, JSON.stringify(media, null, 2), "utf-8");
    return true;
  } catch (e) {
    cheese.error(
      debugPrefix,
      `Writing media to ${mediaTargetPath} failed with the following error:`,
      e,
    );
    return false;
  }
};
