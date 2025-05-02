import {
    createPublicClient,
    getContract,
    http,
    formatUnits,
  } from "viem";
  import { monadTestnet } from "viem/chains";
  
  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });
  
  export type TokenType = "ERC20" | "ERC721" | "ERC1155" | "Desconhecido";
  
  export async function detectTokenType(address: `0x${string}`) {
    try {
      const bytecode = await client.getBytecode({ address });
      if (!bytecode || bytecode === "0x") {
        throw new Error("Endereço não é um contrato.");
      }
  
      // Tenta como ERC20
      try {
        const erc20 = getContract({
          address,
          abi: [
            { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
            { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
            { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
            { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
          ],
          client,
        });
  
        const [name, symbol, decimals, totalSupply] = await Promise.all([
          erc20.read.name(),
          erc20.read.symbol(),
          erc20.read.decimals(),
          erc20.read.totalSupply(),
        ]);
  
        return {
          type: "ERC20" as const,
          name,
          symbol,
          decimals,
          totalSupply: formatUnits(totalSupply, decimals),
        };
      } catch {}
  
      // Tenta como ERC721
      try {
        const erc721 = getContract({
          address,
          abi: [
            {
              name: "supportsInterface",
              type: "function",
              stateMutability: "view",
              inputs: [{ name: "interfaceId", type: "bytes4" }],
              outputs: [{ type: "bool" }],
            },
            { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
            { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
          ],
          client,
        });
  
        const is721 = await erc721.read.supportsInterface(["0x80ac58cd"]);
        if (!is721) throw new Error("Não é ERC721");
  
        const [name, symbol] = await Promise.all([
          erc721.read.name(),
          erc721.read.symbol(),
        ]);
  
        return {
          type: "ERC721" as const,
          name,
          symbol,
        };
      } catch {}
  
      // Tenta como ERC1155 (com tentativa de name/symbol)
      try {
        const erc1155 = getContract({
          address,
          abi: [
            {
              name: "supportsInterface",
              type: "function",
              stateMutability: "view",
              inputs: [{ name: "interfaceId", type: "bytes4" }],
              outputs: [{ type: "bool" }],
            },
          ],
          client,
        });
  
        const is1155 = await erc1155.read.supportsInterface(["0xd9b67a26"]);
        if (!is1155) throw new Error("Não é ERC1155");
  
        // Tenta pegar name e symbol SE existirem
        let name: string | null = null;
        let symbol: string | null = null;
  
        try {
          const meta = getContract({
            address,
            abi: [
              {
                name: "name",
                type: "function",
                stateMutability: "view",
                inputs: [],
                outputs: [{ type: "string" }],
              },
              {
                name: "symbol",
                type: "function",
                stateMutability: "view",
                inputs: [],
                outputs: [{ type: "string" }],
              },
            ],
            client,
          });
  
          [name, symbol] = await Promise.all([
            meta.read.name().catch(() => null),
            meta.read.symbol().catch(() => null),
          ]);
        } catch {
          // nada a fazer se falhar
        }
  
        return {
          type: "ERC1155" as const,
          name,
          symbol,
        };
      } catch {}
  
      return { type: "Desconhecido" as const };
    } catch (e) {
      console.warn("Erro ao detectar tipo:", e);
      return { type: "Desconhecido" as const };
    }
  }
  