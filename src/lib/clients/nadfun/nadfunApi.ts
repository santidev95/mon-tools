const BASE_URL = "https://testnet-bot-api-server.nad.fun";

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function getAccountPositions(address: string, positionType: string, page = 1, limit = 10) {
  return fetchJson(`${BASE_URL}/account/position/${address}?position_type=${positionType}&page=${page}&limit=${limit}`);
}

export async function getCreatedTokens(address: string, page = 1, limit = 10) {
  return fetchJson(`${BASE_URL}/account/create_token/${address}?page=${page}&limit=${limit}`);
}

export async function getTokensByCreationTime(page = 1, limit = 10) {
  return fetchJson(`${BASE_URL}/order/creation_time?page=${page}&limit=${limit}`);
}

export async function getTokensByMarketCap(page = 1, limit = 10) {
  return fetchJson(`${BASE_URL}/order/market_cap?page=${page}&limit=${limit}`);
}

export async function getTokensByLatestTrade(page = 1, limit = 10) {
  return fetchJson(`${BASE_URL}/order/latest_trade?page=${page}&limit=${limit}`);
}

export async function getTokenInfo(tokenAddress: string) {
  return fetchJson(`${BASE_URL}/token/${tokenAddress}`);
}


export async function getTokenHolders(tokenAddress: string, page = 1, limit = 10) {
  return fetchJson(`${BASE_URL}/token/holder/${tokenAddress}?page=${page}&limit=${limit}`);
}
