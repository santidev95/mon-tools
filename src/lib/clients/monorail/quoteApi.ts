// Monorail Pathfinder Quote API client

// --- TypeScript interfaces based on OpenAPI spec ---

export interface GeneratedTransaction {
  data: string;
  to: string;
  value: string;
}

export interface PathfinderSplit {
  fee: string;
  input: string;
  input_formatted: string;
  min_output: string;
  min_output_formatted: string;
  output: string;
  output_formatted: string;
  percentage: string;
  price_impact: string;
  protocol: string;
}

export interface PathfinderRoute {
  from: string;
  from_symbol: string;
  input: string;
  input_formatted: string;
  output: string;
  output_formatted: string;
  splits: PathfinderSplit[];
  to: string;
  to_symbol: string;
  vs: string;
  weighted_price_impact: string;
}

export interface PathfinderQuoteOutput {
  block: number;
  compound_impact: string;
  from: string;
  hops: number;
  input: string;
  input_formatted: string;
  min_output: string;
  min_output_formatted: string;
  output: string;
  output_formatted: string;
  routes: PathfinderRoute[][];
  to: string;
  transaction?: GeneratedTransaction;
}

export interface PathfinderErrorResponse {
  message: string;
}

export interface GetQuoteParams {
  from: string;
  to: string;
  amount: string;
  sender?: string;
  excluded_protocols?: string;
  max_slippage?: number;
  deadline?: number;
  max_hops?: number;
  source?: string;
}

const BASE_URL = 'https://testnet-pathfinder-v2.monorail.xyz/v3';

/**
 * Get a detailed quote for swapping tokens, including price impact, routes, and transaction data.
 * @param params Query parameters for the quote request
 */
export async function getQuote(params: GetQuoteParams): Promise<PathfinderQuoteOutput> {
  const url = new URL(`${BASE_URL}/quote`);
  url.searchParams.append('from', params.from);
  url.searchParams.append('to', params.to);
  url.searchParams.append('amount', params.amount);
  if (params.sender) url.searchParams.append('sender', params.sender);
  if (params.excluded_protocols) url.searchParams.append('excluded_protocols', params.excluded_protocols);
  if (params.max_slippage !== undefined) url.searchParams.append('max_slippage', params.max_slippage.toString());
  if (params.deadline !== undefined) url.searchParams.append('deadline', params.deadline.toString());
  if (params.max_hops !== undefined) url.searchParams.append('max_hops', params.max_hops.toString());
  if (params.source) url.searchParams.append('source', params.source);

  const res = await fetch(url.toString());
  if (!res.ok) throw (await res.json()) as PathfinderErrorResponse;
  return res.json();
}
