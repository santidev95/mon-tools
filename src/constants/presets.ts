export const TOKEN_PROFILES = [
  'basic',
  'burnable',
  'capped',
  'pausable',
  'mintable',
] as const;

export type TokenProfile = (typeof TOKEN_PROFILES)[number];
