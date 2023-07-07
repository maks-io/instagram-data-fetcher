export const getHelp = (inclHeader = false) => {
  let help = "";
  if (inclHeader) {
    help += "instagram-data-fetcher\n";
    help +=
      "Fetch instagram picture data from one or more accounts, via long lived tokens.\n";
  }
  help += "\n";
  help += "Usage:\n";
  help += "igdf -c PATH_TO_YOUR_CONFIG\n";

  help += "\n";
  help += "Options:\n";
  help += "-c / --config (mandatory)\tProvide the path to a valid config.";

  return help;
};
