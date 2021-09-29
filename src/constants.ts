import { providers } from "@0xsequence/multicall"
import { ethers } from "ethers"

export const ARBITRUM_EXPLORER = "https://smartscan.cash/"
export const ARBITRUM_DEFAULT_RPC = "https://smartbch.greyh.at/"
export const ARBITRUM_CHAIN_ID = 10000

export const EXPLORER_ADDR = "https://smartscan.cash/"
export const SmolPuddleContract = "0xccCA17Bc63599025762F48D4B2Bb690C640C4239"
export const STATIC_PROVIDER = new providers.MulticallProvider(
  new ethers.providers.JsonRpcProvider(ARBITRUM_DEFAULT_RPC),
  { batchSize: 100, timeWindow: 500, verbose: false }
)
