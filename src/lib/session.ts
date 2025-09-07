/**
 * Wallet Session Management
 * Handles user session identification using local storage
 */

export class WalletSession {
  private static instance: WalletSession;
  private sessionId: string;
  private sessionKey: string;
  private readonly SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  private constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.sessionKey = this.generateSessionKey();
    this.updateLastAccess();
  }

  static getInstance(): WalletSession {
    if (!WalletSession.instance) {
      WalletSession.instance = new WalletSession();
    }
    return WalletSession.instance;
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('wallet_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('wallet_session_id', sessionId);
    }
    return sessionId;
  }

  private generateSessionKey(): string {
    let sessionKey = localStorage.getItem('wallet_session_key');
    if (!sessionKey) {
      // Generate a random key for this session
      const randomBytes = new Uint8Array(32);
      crypto.getRandomValues(randomBytes);
      sessionKey = Array.from(randomBytes, byte => 
        byte.toString(16).padStart(2, '0')
      ).join('');
      localStorage.setItem('wallet_session_key', sessionKey);
    }
    return sessionKey;
  }

  private updateLastAccess(): void {
    const sessionData = {
      id: this.sessionId,
      created: this.getSessionCreated(),
      lastAccess: new Date().toISOString(),
      userAgent: navigator.userAgent,
      key: this.sessionKey
    };
    localStorage.setItem('wallet_session_data', JSON.stringify(sessionData));
  }

  private getSessionCreated(): string {
    const sessionData = localStorage.getItem('wallet_session_data');
    if (sessionData) {
      const data = JSON.parse(sessionData);
      return data.created || new Date().toISOString();
    }
    return new Date().toISOString();
  }

  getSessionId(): string {
    this.updateLastAccess();
    return this.sessionId;
  }

  getSessionKey(): string {
    return this.sessionKey;
  }

  getSessionData(): any {
    const sessionData = localStorage.getItem('wallet_session_data');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  // Check if session is valid
  isSessionValid(): boolean {
    const sessionData = this.getSessionData();
    if (!sessionData) return false;
    
    const now = new Date();
    const lastAccess = new Date(sessionData.lastAccess);
    
    // Session expires after 30 days of inactivity
    const thirtyDaysAgo = new Date(now.getTime() - this.SESSION_DURATION);
    return lastAccess > thirtyDaysAgo;
  }

  // Clear session (logout)
  clearSession(): void {
    localStorage.removeItem('wallet_session_id');
    localStorage.removeItem('wallet_session_key');
    localStorage.removeItem('wallet_session_data');
    
    // Generate new session
    this.sessionId = this.getOrCreateSessionId();
    this.sessionKey = this.generateSessionKey();
    this.updateLastAccess();
  }

  // Get session info for display
  getSessionInfo(): {
    id: string;
    created: string;
    lastAccess: string;
    isValid: boolean;
  } {
    const sessionData = this.getSessionData();
    return {
      id: this.sessionId,
      created: sessionData?.created || 'Unknown',
      lastAccess: sessionData?.lastAccess || 'Unknown',
      isValid: this.isSessionValid()
    };
  }

  // Force refresh session (useful for testing)
  refreshSession(): void {
    this.clearSession();
  }
}

// Export singleton instance
export const walletSession = WalletSession.getInstance();
