import dayjs from "dayjs";
import fs from "fs";
import { getTokenNameInclPath } from "./getTokenNameInclPath.js";
import cheese from "cheese-log";
import { getDebugPrefix } from "./getDebugPrefix.js";
import { DATE_FORMAT } from "./constants";

export const backupTokens = (
  tokenPath: string,
  identifier: string,
): boolean => {
  const debugPrefix = getDebugPrefix("backupTokens()", identifier);

  const now = dayjs();
  const nowAsString = now.format(DATE_FORMAT);

  try {
    const longLivedToken = JSON.parse(
      fs.readFileSync(
        getTokenNameInclPath(tokenPath, identifier, "LONG_LIVED_TOKEN"),
        "utf-8",
      ),
    );
    cheese.debug(debugPrefix, "longLivedToken", longLivedToken);

    fs.writeFileSync(
      getTokenNameInclPath(
        tokenPath,
        identifier,
        "LONG_LIVED_TOKEN",
        nowAsString,
      ),
      JSON.stringify({ ...longLivedToken, backupAt: nowAsString }, null, 2),
      "utf-8",
    );
    return true;
  } catch (e) {
    cheese.debug(
      debugPrefix,
      "Error when trying to backup long lived tokens:",
      e,
    );
    return false;
  }
};
