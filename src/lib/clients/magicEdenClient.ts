const API_URL = "https://api-mainnet.magiceden.dev/v3/rtp/monad-testnet/collections/v7";
const API_KEY = process.env.MAGICEDEN_API_KEY;

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

export interface MagicEdenToken {
  token: {
    chainId: number;
    contract: string;
    tokenId: string;
    kind: string;
    name: string;
    image: string;
    imageSmall: string;
    imageLarge: string;
    metadata: {
      imageOriginal: string;
      imageMimeType: string;
    };
    description: string;
    rarityScore: number | null;
    rarityRank: number | null;
    supply: string;
    remainingSupply: string;
    media: any | null;
    isFlagged: boolean;
    isSpam: boolean;
    metadataDisabled: boolean;
    lastFlagUpdate: string | null;
    lastFlagChange: string | null;
    collection: {
      id: string;
      name: string;
      slug: string | null;
      symbol: string | null;
      imageUrl: string;
      isSpam: boolean;
      metadataDisabled: boolean;
      openseaVerificationStatus: string | null;
      floorAskPrice: {
        currency: {
          contract: string;
          name: string;
          symbol: string;
          decimals: number;
        };
        amount: {
          raw: string;
          decimal: number;
          usd: number | null;
          native: number;
        };
      };
      royaltiesBps: number;
      royalties: Array<{
        bps: number;
        recipient: string;
      }>;
    };
    lastAppraisalValue: number | null;
  };
  ownership: {
    tokenCount: string;
    onSaleCount: string;
    floorAsk: {
      id: string | null;
      price: any | null;
      maker: string | null;
      kind: string | null;
      validFrom: string | null;
      validUntil: string | null;
      source: string | null;
    };
    acquiredAt: string;
  };
}

export interface UserTokensResponse {
  tokens: MagicEdenToken[];
  continuation: string | null;
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

/**
 * Fetches tokens owned by a wallet with pagination support.
 * @param wallet Wallet address
 * @param limit Number of tokens to fetch (default: 1)
 * @param continuation Continuation token for pagination
 * @returns List of tokens and continuation token
 */
export async function fetchUserTokens(
  wallet: string,
  limit: number = 20,
  continuation?: string
): Promise<UserTokensResponse | null> {
  const params = new URLSearchParams({
    wallet,
    limit: limit.toString(),
  });

  if (continuation) {
    params.append("continuation", continuation);
  }

  const url = `/api/magiceden/user-tokens?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.warn("Magic Eden user tokens API error:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    return null;
  }
}
