import { createPublicClient, createWalletClient, http, getAddress, defineChain, custom } from "viem";
import { ADDRESSES, DEFAULT_CHAIN_ID } from "./addresses";
import walletImplAbi from "./abi/WalletImplementation.json";
import factoryAbi from "./abi/WalletFactory.json";
import registryAbi from "./abi/WNSRegistry.json";
import recoveryAbi from "./abi/RecoveryManager.json";

export const wChainTestnet = defineChain({
  id: 71117,
  name: "W Chain Testnet",
  nativeCurrency: { name: "WCO", symbol: "WCO", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc-testnet.w-chain.com"] }, public: { http: ["https://rpc-testnet.w-chain.com"] } },
  blockExplorers: { default: { name: "W Scan Testnet", url: "https://scan-testnet.w-chain.com" } },
});

export const wChain = defineChain({
  id: 171717,
  name: "W Chain",
  nativeCurrency: { name: "WCO", symbol: "WCO", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.w-chain.com"] }, public: { http: ["https://rpc.w-chain.com"] } },
  blockExplorers: { default: { name: "W Scan", url: "https://scan.w-chain.com" } },
});

const CHAIN_MAP = {
  71117: wChainTestnet,
  171717: wChain,
} as const;

const activeChainId = (typeof window !== "undefined" && (window as any).__W_CHAIN_ID__) || DEFAULT_CHAIN_ID || 71117;
export const activeChain = CHAIN_MAP[activeChainId as 71117 | 171717] ?? wChainTestnet;

export const publicClient = createPublicClient({
  chain: activeChain,
  transport: http(activeChain.rpcUrls.default.http[0]),
});

export const walletClient = typeof window !== "undefined" && (window as any).ethereum
  ? createWalletClient({ chain: activeChain, transport: custom((window as any).ethereum) })
  : undefined;

const addresses = ADDRESSES[activeChainId as keyof typeof ADDRESSES];

export const contracts = {
  walletImplementation: { address: getAddress(addresses.WalletImplementation), abi: walletImplAbi as any },
  walletFactory: { address: getAddress(addresses.WalletFactory), abi: factoryAbi as any },
  wnsRegistry: { address: getAddress(addresses.WNSRegistry), abi: registryAbi as any },
  recoveryManager: { address: getAddress(addresses.RecoveryManager), abi: recoveryAbi as any },
} as const;
