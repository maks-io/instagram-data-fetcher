import cheese from "cheese-log";
import fs from "fs";
import axios from "axios";
import { getTokenNameInclPath } from "./getTokenNameInclPath.js";
import { getDebugPrefix } from "./getDebugPrefix.js";
import dayjs from "dayjs";
import { DATE_FORMAT } from "./constants";

export const refreshToken = async (
  tokenPathAbsolute: string,
  contextName: string
): Promise<boolean> => {
  const debugPrefix = getDebugPrefix("refreshToken()", contextName);

  try {
    cheese.debug(debugPrefix, "start...");

    let haveLongLivedToken = false;
    let longLivedTokenRaw;
    let longLivedToken;

    const longLivedTokenName = getTokenNameInclPath(
      tokenPathAbsolute,
      contextName,
      "LONG_LIVED_TOKEN"
    );

    cheese.debug(debugPrefix, "longLivedTokenName:", longLivedTokenName);

    try {
      longLivedTokenRaw = fs.readFileSync(longLivedTokenName, "utf-8");

      cheese.debug(debugPrefix, "longLivedTokenRaw:", longLivedTokenRaw);

      if (longLivedTokenRaw) {
        haveLongLivedToken = true;
      }
    } catch (error) {
      // do nothing
    }

    if (!haveLongLivedToken) {
      cheese.error(debugPrefix, "No long-lived token available");
      return false;
    }

    longLivedToken = JSON.parse(longLivedTokenRaw);

    cheese.debug(debugPrefix, "longLivedToken", longLivedToken);

    const longLivedTokenRefreshResult = await axios.get(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${longLivedToken.value}`
    );

    cheese.debug(
      debugPrefix,
      "longLivedTokenRefreshResult.data",
      longLivedTokenRefreshResult.data
    );

    const now = dayjs();
    const nowAsString = now.format(DATE_FORMAT);

    fs.writeFileSync(
      getTokenNameInclPath(tokenPathAbsolute, contextName, "LONG_LIVED_TOKEN"),
      JSON.stringify(
        {
          type: "LONG_LIVED_TOKEN",
          value: longLivedTokenRefreshResult.data.access_token,
          createdAt: nowAsString,
          userId: longLivedTokenRefreshResult.data.user_id,
        },
        null,
        2
      ),
      "utf-8"
    );

    cheese.debug(debugPrefix, "RefreshToken - done.");
    return true;
  } catch (error) {
    cheese.error(debugPrefix, "error:", error.message);
    return false;
  }
};
