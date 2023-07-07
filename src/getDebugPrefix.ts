export const getDebugPrefix = (
  headline: string,
  contextName: string
): string => {
  return `${headline}: (${contextName})`;
};
