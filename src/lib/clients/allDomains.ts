import { TldParser, NetworkWithRpc } from '@onsol/tldparser';
import { getAddress } from 'ethers';


let parser: TldParser | null = null;

export function getTldParser(): TldParser {
    if (!parser) {
      const network = new NetworkWithRpc('monad', 10143, process.env.ALCHEMY_URL || 'https://monad-testnet.g.alchemy.com/v2/FZhCjyj9iYvSCrnRcV4CcDXKzFrfrp5m');
      parser = new TldParser(network, 'monad');
    }
    return parser;
  }

// Core methods for interacting with AllDomains
export const allDomainsClient = {
  /**
   * Get all domains owned by a user
   * @param userAccount - The user's wallet address
   * @returns Array of domain records
   */
  getAllUserDomains: async (userAccount: string) => {
    const parser = getTldParser();
    return await parser.getAllUserDomains(userAccount);
  },

  /**
   * Get domains for a specific TLD owned by a user
   * @param userAccount - The user's wallet address
   * @param tld - The TLD to filter by (e.g., '.mon')
   * @returns Array of domain records for the specified TLD
   */
  getAllUserDomainsFromTld: async (userAccount: string, tld: string) => {
    const parser = getTldParser();
    return await parser.getAllUserDomainsFromTld(userAccount, tld);
  },

  /**
   * Get the owner of a domain
   * @param domainTld - The full domain name with TLD (e.g., 'miester.mon')
   * @returns The owner's wallet address
   */
  getOwnerFromDomainTld: async (domainTld: string) => {
    const parser = getTldParser();
    return await parser.getOwnerFromDomainTld(domainTld);
  },

  /**
   * Get detailed record data for a domain
   * @param domainTld - The full domain name with TLD (e.g., 'miester.mon')
   * @returns Detailed domain record information
   */
  getNameRecordFromDomainTld: async (domainTld: string) => {
    const parser = getTldParser();
    return await parser.getNameRecordFromDomainTld(domainTld);
  },

  /**
   * Get the user's main domain
   * @param userAddress - The user's wallet address
   * @returns The user's main domain record
   */
  getMainDomain: async (userAddress: string) => {
    const parser = getTldParser();
    return await parser.getMainDomain(userAddress);
  }
};