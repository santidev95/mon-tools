import { ethers } from "ethers";
import routerAbi from "../../abi/IUniswapV2Router.json" assert { type: "json" };
import tokenAbi from "../../abi/IToken.json" assert { type: "json" };

// CONFIGURATION
const routerAddress = "0x619d07287e87C9c643C60882cA80d23C8ed44652"; // UniswapV2 Router on Monad Testnet
const wrappedMonAddress = "0x3bb9AFB94c82752E47706A10779EA525Cf95dc27"; // Wrapped MON address
const rpcUrl = "https://testnet-rpc.monad.xyz";

/**
 * Buys a token from the DEX (UniswapV2 Router) after the token is listed.
 * 
 * @param privateKey Private key of the buyer
 * @param tokenAddress Token address to buy
 * @param amountMON Amount of MON to spend (string format, e.g., "1.0")
 * @param slippage Slippage percentage (default 0.5%)
 * @returns Transaction hash
 */
export async function buyFromDex(
  privateKey: string,
  tokenAddress: string,
  amountMON: string,
  slippage = 0.5
): Promise<string> {

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const router = new ethers.Contract(routerAddress, routerAbi, wallet);

  const response = await fetch(`https://testnet-bot-api-server.nad.fun/token/${tokenAddress}`);
  const tokenData = await response.json();

  if (!tokenData.is_listing) {
    throw new Error(`❌ Token ${tokenData.name} - ${tokenData.symbol} is not listed yet. Use bonding curve functions to buy instead.`);
  }

  // Parse input values
  const valueInWei = ethers.parseEther(amountMON);
  const path = [wrappedMonAddress, tokenAddress];
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60);

  const amountsOut = await router.getAmountsOut(valueInWei, path);
  const expectedTokenAmount = amountsOut[1];

  // Calculate minimum tokens considering slippage
  const slippageFactor = 1000n - BigInt(Math.floor(slippage * 10));
  const minTokens = (expectedTokenAmount * slippageFactor) / 1000n;

  const tx = await router.swapExactNativeForTokens(
    minTokens,
    path,
    wallet.address,
    deadline,
    {
      value: valueInWei,
    }
  );

  await tx.wait();
  return tx.hash;
}

/**
 * Sells a token to the DEX (UniswapV2 Router) after the token is listed.
 * 
 * @param privateKey Private key of the seller
 * @param tokenAddress Token address to sell
 * @param amountTokens Amount of tokens to sell (string format, e.g., "1000.0")
 * @param slippage Slippage percentage (default 0.5%)
 * @returns Transaction hash
 */
export async function sellToDex(
    privateKey: string,
    tokenAddress: string,
    amountTokens: string,
    slippage = 0.5
  ): Promise<string> {

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const router = new ethers.Contract(routerAddress, routerAbi, wallet);
    const token = new ethers.Contract(tokenAddress, tokenAbi, wallet);
  
    const response = await fetch(`https://testnet-bot-api-server.nad.fun/token/${tokenAddress}`);
    const tokenData = await response.json();
  
    if (!tokenData.is_listing) {
      throw new Error("❌ Token is not listed yet. Use bonding curve functions to sell instead.");
    }
  
    // Parse values
    const tokenAmountInWei = ethers.parseEther(amountTokens);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60);
    const path = [tokenAddress, wrappedMonAddress];
    
    // Approve Router to spend tokens
    const approveTx = await token.approve(routerAddress, tokenAmountInWei);
    await approveTx.wait();

    const amountsOut = await router.getAmountsOut(tokenAmountInWei, path);
    const expectedMONAmount = amountsOut[1];
    
    // Calculate minimum acceptable amount with slippage
    const slippageFactor = 1000n - BigInt(Math.floor(slippage * 10)); // E.g., 0.5% slippage = 995
    const minMonOut = (expectedMONAmount * slippageFactor) / 1000n;  
  
    const tx = await router.swapExactTokensForNative(
      tokenAmountInWei,
      minMonOut,
      path,
      wallet.address,
      deadline
    );
  
    await tx.wait();  
    return tx.hash;
  }
