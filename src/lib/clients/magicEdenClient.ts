const API_URL = "https://api-mainnet.magiceden.dev/v3/rtp/monad-testnet/collections/v7";
const API_KEY = "d79f52a1-1a8c-42a0-9d6b-7afaf5a6e54c";

export interface MagicEdenCollection {
  id: string;
  name: string;
  description?: string;
  image?: string;
  externalUrl?: string;
  discordUrl?: string;
  tokenCount: string;
  onSaleCount: string;
  ownerCount: number;
  createdAt: string;
  supply: string;
  remainingSupply: string;
  floorAsk?: {
    price: {
      amount: {
        decimal: number;
      };
    };
    token?: {
      name?: string;
      tokenId?: string;
      image?: string;
    };
  };
  volume?: {
    "1day"?: number;
    "7day"?: number;
    "30day"?: number;
    "allTime"?: number;
  };
  rank?: {
    "1day"?: number;
    "allTime"?: number;
  };
  sampleImages?: string[];
}

export interface UserCollection {
  collection: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    tokenCount: string;
    primaryContract: string;
    floorAskPrice?: {
      amount: {
        decimal: number;
      };
    };
    volume?: {
      "1day"?: number;
      "7day"?: number;
      "30day"?: number;
      "allTime"?: number;
    };
    rank?: {
      "1day"?: number;
      "7day"?: number;
      "30day"?: number;
      "allTime"?: number;
    };
  };
  ownership: {
    tokenCount: string;
    onSaleCount: string;
  };
}

export async function fetchMagicEdenCollection(contract: string): Promise<MagicEdenCollection | null> {
  const url = `${API_URL}?contract=${contract}&includeMintStages=true&includeSecurityConfigs=true`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    console.warn(`Magic Eden API returned ${response.status}`);
    return null;
  }

  const data = await response.json();

  if (!data.collections || data.collections.length === 0) {
    return null;
  }

  return data.collections[0] as MagicEdenCollection;
}

/**
 * Fetches collections owned by a wallet for a specific contract.
 * @param wallet Wallet address
 * @param contract Contract address of the collection
 * @returns Collection + ownership info if found, or null
 */
export async function fetchUserCollectionByContract(
  wallet: string,
  contract: string
): Promise<UserCollection | null> {
  const url = `https://api-mainnet.magiceden.dev/v3/rtp/monad-testnet/users/${wallet}/collections/v3?collection=${contract}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    console.warn("Magic Eden user collection API error:", response.status);
    return null;
  }

  const data = await response.json();
  const result = data.collections?.[0] ?? null;
  return result;
}
