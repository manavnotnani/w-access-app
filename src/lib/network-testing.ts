// Network testing utilities for development
// This file helps you test both testnet and mainnet configurations locally

export function setTestnet() {
  if (typeof window !== "undefined") {
    (window as any).__W_CHAIN_ID__ = 71117;
    // Store in localStorage for persistence
    localStorage.setItem('w-chain-network', 'testnet');
    console.log("🌐 Switched to Testnet (71117)");
    console.log("🔄 Refreshing page to apply changes...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

export function setMainnet() {
  if (typeof window !== "undefined") {
    (window as any).__W_CHAIN_ID__ = 171717;
    // Store in localStorage for persistence
    localStorage.setItem('w-chain-network', 'mainnet');
    console.log("🌐 Switched to Mainnet (171717)");
    console.log("🔄 Refreshing page to apply changes...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

export function getCurrentChainId() {
  if (typeof window !== "undefined") {
    return (window as any).__W_CHAIN_ID__;
  }
  return null;
}

export function getCurrentNetwork() {
  const chainId = getCurrentChainId();
  if (chainId === 71117) return "testnet";
  if (chainId === 171717) return "mainnet";
  return "unknown";
}

// Initialize network on app startup
export function initializeNetwork() {
  if (typeof window !== "undefined") {
    const storedNetwork = localStorage.getItem('w-chain-network');
    if (storedNetwork === 'mainnet') {
      (window as any).__W_CHAIN_ID__ = 171717;
    } else if (storedNetwork === 'testnet') {
      (window as any).__W_CHAIN_ID__ = 71117;
    }
  }
}

// Debug function to check network state
export function debugNetwork() {
  if (typeof window !== "undefined") {
    const storedNetwork = localStorage.getItem('w-chain-network');
    const windowChainId = (window as any).__W_CHAIN_ID__;
    
    console.log("🔍 Network Debug Info:");
    console.log("  localStorage:", storedNetwork);
    console.log("  window.__W_CHAIN_ID__:", windowChainId);
    console.log("  getCurrentNetwork():", getCurrentNetwork());
    console.log("  getCurrentChainId():", getCurrentChainId());
    
    return {
      localStorage: storedNetwork,
      windowChainId,
      currentNetwork: getCurrentNetwork(),
      currentChainId: getCurrentChainId()
    };
  }
  return null;
}

// Add to window for easy console access
if (typeof window !== "undefined") {
  (window as any).setTestnet = setTestnet;
  (window as any).setMainnet = setMainnet;
  (window as any).getCurrentNetwork = getCurrentNetwork;
  (window as any).getCurrentChainId = getCurrentChainId;
  (window as any).initializeNetwork = initializeNetwork;
  (window as any).debugNetwork = debugNetwork;
}
