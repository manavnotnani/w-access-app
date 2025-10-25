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

// Function to get current chain ID dynamically
function getCurrentChainId() {
  // Check for environment variable first, then localStorage, then window global, then default
  if (import.meta.env.VITE_W_CHAIN_ID) {
    return Number(import.meta.env.VITE_W_CHAIN_ID);
  }
  
  if (typeof window !== "undefined") {
    // Check localStorage for persisted network choice
    const storedNetwork = localStorage.getItem('w-chain-network');
    if (storedNetwork === 'mainnet') {
      return 171717;
    } else if (storedNetwork === 'testnet') {
      return 71117;
    }
    
    // Fallback to window global
    if ((window as any).__W_CHAIN_ID__) {
      return (window as any).__W_CHAIN_ID__;
    }
  }
  
  return DEFAULT_CHAIN_ID || 71117;
}

// Dynamic chain and client creation
export function getActiveChain() {
  const chainId = getCurrentChainId();
  return CHAIN_MAP[chainId as 71117 | 171717] ?? wChainTestnet;
}

// Legacy export for backward compatibility
export const activeChain = getActiveChain();

// Dynamic client creation functions
export function getPublicClient() {
  const currentChain = getActiveChain();
  
  return createPublicClient({
    chain: currentChain,
    transport: http(currentChain.rpcUrls.default.http[0]),
  });
}

export function getWalletClient() {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    return undefined;
  }
  
  const currentChain = getActiveChain();
  
  return createWalletClient({ 
    chain: currentChain, 
    transport: custom((window as any).ethereum) 
  });
}

// Legacy exports for backward compatibility
export const publicClient = getPublicClient();
export const walletClient = getWalletClient();

// Dynamic contracts function
export function getContracts() {
  const currentChainId = getCurrentChainId();
  const addresses = ADDRESSES[currentChainId as keyof typeof ADDRESSES];
  
  if (!addresses) {
    throw new Error(`No addresses found for chain ID ${currentChainId}`);
  }
  
  return {
    walletImplementation: { address: getAddress(addresses.WalletImplementation), abi: walletImplAbi as any },
    walletFactory: { address: getAddress(addresses.WalletFactory), abi: factoryAbi as any },
    wnsRegistry: { address: getAddress(addresses.WNSRegistry), abi: registryAbi as any },
    recoveryManager: { address: getAddress(addresses.RecoveryManager), abi: recoveryAbi as any },
  } as const;
}

// Legacy export for backward compatibility
export const contracts = getContracts();
