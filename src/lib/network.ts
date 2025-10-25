// Network utility functions for network detection and URL generation

export function getCurrentNetwork(): 'testnet' | 'mainnet' {
  // Check environment variable first
  if (import.meta.env.VITE_NETWORK_TYPE) {
    return import.meta.env.VITE_NETWORK_TYPE as 'testnet' | 'mainnet';
  }
  
  // Check localStorage for persisted choice
  if (typeof window !== "undefined") {
    const storedNetwork = localStorage.getItem('w-chain-network');
    if (storedNetwork === 'mainnet' || storedNetwork === 'testnet') {
      return storedNetwork as 'testnet' | 'mainnet';
    }
  }
  
  // Default to testnet
  return 'testnet';
}

export function isMainnet(): boolean {
  return getCurrentNetwork() === 'mainnet';
}

export function isTestnet(): boolean {
  return getCurrentNetwork() === 'testnet';
}

export function getOppositeNetworkUrl(): string | null {
  const currentNetwork = getCurrentNetwork();
  
  if (currentNetwork === 'mainnet') {
    return import.meta.env.VITE_TESTNET_URL || 'https://testnet.w-access.xyz';
  } else {
    return import.meta.env.VITE_MAINNET_URL || 'https://w-access.xyz';
  }
}

export function getOppositeNetworkName(): string {
  return isMainnet() ? 'Testnet' : 'Mainnet';
}

export function getCurrentNetworkName(): string {
  return isMainnet() ? 'Mainnet' : 'Testnet';
}

export function shouldShowNetworkSwitcher(): boolean {
  // Always show switcher if we have opposite network URL configured
  const oppositeUrl = getOppositeNetworkUrl();
  return oppositeUrl !== null && oppositeUrl !== '';
}
