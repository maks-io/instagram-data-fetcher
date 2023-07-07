import fs from "fs";
import cheese from "cheese-log";
import { getDebugPrefix } from "./getDebugPrefix";

export const cleanupTokens = (
  tokenPath: string,
  identifier: string,
  nrOfTokenBackups: number,
) => {
  const debugPrefix = getDebugPrefix("cleanupTokens()", identifier);

  try {
    const files = fs.readdirSync(tokenPath);
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
      e,
    );
    // do nothing
  }
};
