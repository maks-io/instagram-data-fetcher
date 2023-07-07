import { LongLivedToken } from "./Token";
import fs from "fs";
import cheese from "cheese-log";
import axios from "axios";
import { getTokenNameInclPath } from "./getTokenNameInclPath.js";
import { getDebugPrefix } from "./getDebugPrefix.js";

export const getMedia = async (
  tokenPathAbsolute: string,
  contextName: string
): Promise<any> => {
  const debugPrefix = getDebugPrefix("getMedia()", contextName);

  let longLivedTokenRaw: LongLivedToken;
  const longLivedTokenName = getTokenNameInclPath(
    tokenPathAbsolute,
    contextName,
    "LONG_LIVED_TOKEN"
  );

  try {
    longLivedTokenRaw = JSON.parse(
      fs.readFileSync(longLivedTokenName, "utf-8")
    );
  } catch (e) {
    cheese.error(
      debugPrefix,
      `Error parsing longLivedToken for ${longLivedTokenName}:`,
      e
    );
    return; // TODO
  }

  cheese.debug(debugPrefix, "longLivedTokenRaw:", longLivedTokenRaw);

  try {
    const media = await axios.get(
      // TODO this url is correct:
       `https://graph.instagram.com/me/media?fields=permalink,id,caption,media_url,timestamp&limit=1000&access_token=${longLivedTokenRaw.value}`

      // TODO following url leads to circular object:
    //  `https://graph.instagram.com/me/media?fields=permalink,id,caption,media_url,timestamp,like_count,comments_count&limit=1000&access_token=${longLivedTokenRaw.value}`
    );

    return media?.data?.data;
  } catch (error) {
    console.log("DEBUG e2", error);
    cheese.error(
      debugPrefix,
      "Failed to fetch instagram pictures because of the following error",
      error
    );
    return; // TODO
  }
};
