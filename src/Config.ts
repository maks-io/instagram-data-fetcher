interface SingleConfig {
  identifier: string;
  instagramAppId: string;
  instagramAppSecret: string;
  tokenPath: string;
  nrOfTokenBackups: number;
  mediaTargetPath: string;
}

export type Config = SingleConfig[];
