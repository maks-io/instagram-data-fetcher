import { TokenType } from "./Token";

export const getTokenNameInclPath = (
  tokenPathAbsolute: string,
  contextName: string,
  tokenType: TokenType,
  backupTimestamp?: string
): string => {
  const tokenName = `${
    tokenType === "LONG_LIVED_TOKEN" ? "long" : "short"
  }LivedToken`;
  const backupTimestampSuffix = !backupTimestamp ? "" : `__BACKUP_${backupTimestamp}`;
  return `${tokenPathAbsolute}/${contextName}_${tokenName}${backupTimestampSuffix}.json`;
};
