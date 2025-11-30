const API_URL = "https://api-mainnet.magiceden.dev/v3/rtp/monad-testnet/collections/v7";
const API_KEY = process.env.MAGICEDEN_API_KEY;

export interface MagicEdenCollection {
  id: string;
  name: string;
  description?: string;
  image?: string;
  externalUrl?: string;
  discordUrl?: string;
  tokenCount?: string;
  onSaleCount?: string;
  ownerCount?: number;
  createdAt?: string;
  supply?: string;
  remainingSupply?: string;
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
  // Novos campos do formato v4
  chain?: string;
  symbol?: string;
  media?: {
    url?: string;
  };
  social?: {
    twitterUsername?: string;
    discordUrl?: string;
    websiteUrl?: string;
  };
  verification?: string;
  isTradeable?: boolean;
  royalty?: {
    recipient?: string;
    bps?: number;
    isOptional?: boolean;
  };
  collectionType?: string;
  chainData?: {
    contract?: string;
    transferability?: string;
    collectionBidSupported?: boolean;
    isMinting?: boolean;
  };
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

export interface UserCollectionV4 {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  description?: string;
  media?: {
    url?: string;
  };
  social?: {
    twitterUsername?: string;
    discordUrl?: string;
    websiteUrl?: string;
  };
  verification?: string;
  isTradeable?: boolean;
  royalty?: {
    recipient?: string;
    bps?: number;
    isOptional?: boolean;
  };
  collectionType?: string;
  isSeaportV16Disabled?: boolean;
  isSeaportV16RoyaltyOptional?: boolean;
  seaportV16ListingCurrencies?: any[];
  chainData?: {
    contract?: string;
    transferability?: string;
    collectionBidSupported?: boolean;
    isMinting?: boolean;
  };
  ownedCount: number;
  listedCount: number;
}

export interface UserCollectionsResponse {
  collections: UserCollectionV4[];
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
 * Fetches collections owned by a wallet.
 * @param wallet Wallet address
 * @returns List of collections
 */
export async function fetchUserTokens(
  wallet: string,
  limit?: number,
  continuation?: string
): Promise<UserCollectionsResponse | null> {
  const params = new URLSearchParams({
    wallet,
  });

  const url = `/api/magiceden/user-tokens?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.warn("Magic Eden user collections API error:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return null;
  }
}
