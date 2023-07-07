import fs from "fs";
import cheese from "cheese-log";
import { getDebugPrefix } from "./getDebugPrefix";

export const cleanupTokens = (
  tokenPath: string,
  identifier: string,
  nrOfTokenBackups: number
) => {
  const debugPrefix = getDebugPrefix("cleanupTokens()", identifier);

  let files;
  try {
    files = fs.readdirSync(tokenPath);
    const shortLivedTokenBackupFiles = files
      .filter((f) => f.includes("shortLivedToken_"))
      .sort()
      .reverse();
    shortLivedTokenBackupFiles.forEach((file, index) => {
      if (index >= nrOfTokenBackups) {
        fs.unlinkSync(`${tokenPath}/${file}`);
      }
    });
  } catch (e) {
    cheese.debug(
      debugPrefix,
      "Error when trying to cleanup short lived tokens:",
      e
    );
    // do nothing
  }

  try {
    const longLivedTokenBackupFiles = files
      .filter((f) => f.includes("longLivedToken_"))
      .sort()
      .reverse();
    longLivedTokenBackupFiles.forEach((file, index) => {
      if (index >= nrOfTokenBackups) {
        fs.unlinkSync(`${tokenPath}/${file}`);
      }
    });
  } catch (e) {
    cheese.debug(
      debugPrefix,
      "Error when trying to cleanup long lived tokens:",
      e
    );
    // do nothing
  }
};
