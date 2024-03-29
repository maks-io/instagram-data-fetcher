#!/usr/bin/env node
import minimist from "minimist";
import { config as dotenvConfig } from "dotenv";
import { validateConfigFile } from "./validateConfigFile.js";
import { getHelp } from "./getHelp.js";
import { Config } from "./Config";
import fs from "fs";
import { getMedia } from "./getMedia.js";
import { refreshToken } from "./refreshToken.js";
import { backupTokens } from "./backupTokens.js";
import { cleanupTokens } from "./cleanupTokens.js";
import cheese from "cheese-log";
import { writeData } from "./writeData";

dotenvConfig();

const packageJson = require("../package.json");
const argv = minimist(process.argv.slice(2));

const { h, help, v, version, c, config, ...rest } = argv;

const remainingOptions = Object.keys(rest);
if (remainingOptions.length > 1) {
  console.log(`Option '${remainingOptions[1]}' unknown.\n`);
  console.log(getHelp(true));
  process.exit(0);
}

if (h || help) {
  console.log(getHelp(true));
  process.exit(0);
}

if (v || version) {
  console.log(packageJson.version);
  process.exit(0);
}

if (!c && !config) {
  console.log(`A config in json format must be provided via -c or --config.\n`);
  console.log(getHelp(true));
  process.exit(1);
}

cheese.config({
  reportInitialization: false,
  allColorsDisabled: Boolean(process.env.CI),
});

const validationResult = validateConfigFile(c ?? config);
// if string validationResult holds any content, validation failed:
if (validationResult.length > 0) {
  console.log(validationResult);
  console.log(getHelp(true));
  process.exit(1);
}

const parsedConfig: Config = [];
try {
  const jsonData = JSON.parse(fs.readFileSync(c ?? config, "utf-8"));
  Object.keys(jsonData).forEach((identifier) => {
    const data = jsonData[identifier];
    parsedConfig.push({
      identifier,
      instagramAppId: data.instagramAppId,
      instagramAppSecret: data.instagramAppSecret,
      tokenPath: data.tokenPath,
      nrOfTokenBackups: data.nrOfTokenBackups,
      mediaTargetPath: data.mediaTargetPath,
    });
  });
} catch (e) {
  console.log("Error parsing the provided config");
  process.exit(1);
}

(async () => {
  const successfulRuns: Config = [];
  const unsuccessfulRuns: Config = [];

  for (let pc in parsedConfig) {
    const currentConfig = parsedConfig[pc];
    const { tokenPath, identifier, nrOfTokenBackups, mediaTargetPath } =
      currentConfig;

    const backupTokensSuccessful = backupTokens(tokenPath, identifier);

    if (!backupTokensSuccessful) {
      console.error(
        `Backing up the tokens for ${identifier} was not successful. Abort.`,
      );
      return;
    }

    cleanupTokens(tokenPath, identifier, nrOfTokenBackups);

    const refreshTokenSuccessful = await refreshToken(tokenPath, identifier);

    if (!refreshTokenSuccessful) {
      console.error(
        `Refreshing the token for ${identifier} was not successful. Abort.`,
      );
      return;
    }

    const media = await getMedia(tokenPath, identifier);

    const writeDataSuccessful = writeData(identifier, media, mediaTargetPath);
    if (writeDataSuccessful) {
      successfulRuns.push(currentConfig);
    } else {
      successfulRuns.push(currentConfig);
    }
  }

  // report result:
  if (unsuccessfulRuns.length === 0) {
    console.log(`All ${successfulRuns.length} runs successful :)`);
    process.exit(0);
  } else if (successfulRuns.length === 0) {
    console.log(`None of the ${successfulRuns.length} runs successful :(`);
    process.exit(1);
  } else {
    console.log(
      `Some runs successful: ${successfulRuns
        .map((sr) => sr.identifier)
        .join(", ")}`,
    );
    console.log(
      `but others had errors: ${unsuccessfulRuns
        .map((sr) => sr.identifier)
        .join(", ")}`,
    );
    process.exit(1);
  }
})();
