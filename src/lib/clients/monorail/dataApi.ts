// Monorail Data API client

export interface TokenDetails {
  address: string;
  categories: string[];
  decimals: number;
  name: string;
  symbol: string;
}

export interface TokenResult {
  address: string;
  balance?: string;
  categories: string[];
  decimals: number | string;
  id?: string;
  name: string;
  symbol: string;
}

export interface TokenBalance {
  address: string;
  balance: string;
  categories: string[];
  decimals: number;
  id: string;
  name: string;
  symbol: string;
}

export interface ErrorResponse {
  message: string;
}

const BASE_URL = 'https://testnet-api.monorail.xyz/v1';

// Get a token by contract address
export async function getToken(contractAddress: string): Promise<TokenDetails> {
  const res = await fetch(`${BASE_URL}/token/${contractAddress}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Get a list of all available tokens
export async function getTokens(params?: { find?: string; offset?: string; limit?: string }): Promise<TokenResult[]> {
  const url = new URL(`${BASE_URL}/tokens`);
  if (params) {
    if (params.find) url.searchParams.append('find', params.find);
    if (params.offset) url.searchParams.append('offset', params.offset);
    if (params.limit) url.searchParams.append('limit', params.limit);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw await res.json();
  return res.json();
}

// Get a list of tokens in a specific category
export async function getTokensByCategory(category: string, params?: { address?: string; offset?: number; limit?: number }): Promise<TokenResult[]> {
  const url = new URL(`${BASE_URL}/tokens/category/${category}`);
  if (params) {
    if (params.address) url.searchParams.append('address', params.address);
    if (params.offset !== undefined) url.searchParams.append('offset', params.offset.toString());
    if (params.limit !== undefined) url.searchParams.append('limit', params.limit.toString());
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw await res.json();
  return res.json();
}

// Get a count of all available tokens
export async function getTokensCount(): Promise<number> {
  const res = await fetch(`${BASE_URL}/tokens/count`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Get the balances of all tokens for an address
export async function getWalletBalances(address: string): Promise<TokenBalance[]> {
  const res = await fetch(`${BASE_URL}/wallet/${address}/balances`);
  if (!res.ok) throw await res.json();
  return res.json();
}
