import fs from "fs";
import * as path from "path";

export const validateConfigFile = (configFilePath: string): string => {
  try {
    const configFileParsed = JSON.parse(
      fs.readFileSync(configFilePath, "utf-8")
    );

    const entryKeys = Object.keys(configFileParsed);

    if (entryKeys.length === 0) {
      return "You need to provide at least one entry in your config";
    }

    const allowedProps = ["mediaTargetPath", "nrOfTokenBackups", "tokenPath"];
    for (let entryKey of entryKeys) {
      const entry = configFileParsed[entryKey];
      const props = Object.keys(entry).sort();

      const errorPrefix = `Error in config for '${entryKey}':`;

      if (JSON.stringify(props) !== JSON.stringify(allowedProps)) {
        return `${errorPrefix} An entry in the config file must have exactly these props set: ${allowedProps.join(
          ", "
        )}`;
      }

      if (typeof entry.tokenPath !== "string") {
        return `${errorPrefix} The prop 'tokenPath' must be of type string`;
      }

      if (typeof entry.nrOfTokenBackups !== "number") {
        return `${errorPrefix} The prop 'nrOfTokenBackups' must be of type number`;
      }

      if (typeof entry.mediaTargetPath !== "string") {
        return `${errorPrefix} The prop 'mediaTargetPath' must be of type string`;
      }

      const tokenPathDir = path.dirname(entry.tokenPath);
      if (!fs.existsSync(tokenPathDir)) {
        return `${errorPrefix} The 'tokenPath' was set to ${entry.tokenPath} but the directory ${tokenPathDir}/ seems to be not existing`;
      }

      const mediaTargetPathDir = path.dirname(entry.mediaTargetPath);
      if (!fs.existsSync(mediaTargetPathDir)) {
        return `${errorPrefix} The 'mediaTargetPath' was set to ${entry.mediaTargetPath} but the directory ${mediaTargetPathDir}/ seems to be not existing`;
      }
    }
  } catch (e) {
    return `An error occurred when trying trying to read config file from ${configFilePath}:\n${e}`;
  }

  return "";
};
