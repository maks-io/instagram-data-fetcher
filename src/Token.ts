export type TokenType = "LONG_LIVED_TOKEN" | "SHORT_LIVED_TOKEN";

interface Token {
  type: TokenType;
  value: string;
}

export interface LongLivedToken extends Token {
  type: "LONG_LIVED_TOKEN";
  value: string;
}

export interface ShortLivedToken extends Token {
  type: "SHORT_LIVED_TOKEN";
  value: string;
}
