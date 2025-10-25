# W-Access System Flow Diagrams

This document contains comprehensive flow diagrams for the W-Access system, covering wallet creation, transaction processing, recovery processes, and network operations.

## 1. Wallet Creation Flow

```mermaid
graph TD
    A[User Starts Wallet Creation] --> B[Enter Wallet Name]
    B --> C[Generate BIP39 Mnemonic]
    C --> D[Create HD Wallet from Mnemonic]
    D --> E[User Sets PIN]
    E --> F[Encrypt Private Key with PIN]
    F --> G[Store Encrypted Key in localStorage]
    G --> H[Call Wallet Factory Contract]
    H --> I[Deploy Minimal Proxy]
    I --> J[Initialize Wallet with Owner & Name]
    J --> K[Get Wallet Address]
    K --> L[Save Wallet to Database]
    L --> M[Register WNS Name if provided]
    M --> N[Wallet Creation Complete]
    
    style A fill:#e1f5fe
    style N fill:#c8e6c9
    style H fill:#fff3e0
    style I fill:#fff3e0
    style J fill:#fff3e0
```

## 2. Transaction Execution Flow

```mermaid
graph TD
    A[User Initiates Transaction] --> B[Enter PIN to Unlock Wallet]
    B --> C{Is PIN Valid?}
    C -->|No| D[Show Error Message]
    C -->|Yes| E[Decrypt Private Key]
    E --> F[Create Transaction Hash]
    F --> G[Sign Transaction with Private Key]
    G --> H[Check Gas Price]
    H --> I{Is Gas Price Acceptable?}
    I -->|No| J[Adjust Gas Price]
    J --> H
    I -->|Yes| K[Submit Transaction to Network]
    K --> L[Wait for Confirmation]
    L --> M{Transaction Successful?}
    M -->|No| N[Show Error & Retry Option]
    M -->|Yes| O[Update Wallet Balance]
    O --> P[Show Success Message]
    
    style A fill:#e1f5fe
    style P fill:#c8e6c9
    style D fill:#ffcdd2
    style N fill:#ffcdd2
    style K fill:#fff3e0
    style L fill:#fff3e0
```

## 3. Social Recovery Flow

```mermaid
graph TD
    A[Guardian Initiates Recovery] --> B[Enter New Owner Address]
    B --> C[Call Recovery Manager Contract]
    C --> D[Validate Guardian Status]
    D --> E{Is Guardian Valid?}
    E -->|No| F[Show Error Message]
    E -->|Yes| G[Start 2-Day Cooldown]
    G --> H[Recovery Initiated Event]
    H --> I[Owner Can Cancel During Cooldown]
    I --> J{Cooldown Period}
    J --> K[Cooldown Complete]
    K --> L[Anyone Can Complete Recovery]
    L --> M[Call Complete Recovery Function]
    M --> N[Transfer Ownership]
    N --> O[Recovery Completed Event]
    O --> P[New Owner Takes Control]
    
    style A fill:#e1f5fe
    style P fill:#c8e6c9
    style F fill:#ffcdd2
    style G fill:#fff3e0
    style M fill:#fff3e0
    style N fill:#fff3e0
```

## 4. PIN Authentication Flow

```mermaid
graph TD
    A[User Enters PIN] --> B[Derive Key from PIN using PBKDF2]
    B --> C[Attempt to Decrypt Private Key]
    C --> D{Decryption Successful?}
    D -->|No| E[Show Invalid PIN Error]
    D -->|Yes| F[Store Key in Session Storage]
    F --> G[Set 30-Minute Expiration Timer]
    G --> H[User Authenticated]
    H --> I[Enable Wallet Operations]
    I --> J{Session Expired?}
    J -->|No| K[Continue Operations]
    J -->|Yes| L[Clear Session Storage]
    L --> M[Require PIN Re-entry]
    
    style A fill:#e1f5fe
    style H fill:#c8e6c9
    style E fill:#ffcdd2
    style F fill:#fff3e0
    style G fill:#fff3e0
```

## 5. WNS Name Registration Flow

```mermaid
graph TD
    A[User Wants to Register Name] --> B[Enter Desired Name]
    B --> C[Check Name Availability]
    C --> D{Is Name Available?}
    D -->|No| E[Show Name Taken Error]
    D -->|Yes| F[Validate Name Format]
    F --> G{Is Name Valid?}
    G -->|No| H[Show Invalid Name Error]
    G -->|Yes| I[Call WNS Registry Contract]
    I --> J[Register Name to Wallet Address]
    J --> K[Name Registration Event]
    K --> L[Update Database with Name]
    L --> M[Name Registration Complete]
    
    style A fill:#e1f5fe
    style M fill:#c8e6c9
    style E fill:#ffcdd2
    style H fill:#ffcdd2
    style I fill:#fff3e0
    style J fill:#fff3e0
```

## 6. Network Switching Flow

```mermaid
graph TD
    A[User Clicks Network Switch] --> B[Get Current Network]
    B --> C{Current Network?}
    C -->|Testnet| D[Switch to Mainnet]
    C -->|Mainnet| E[Switch to Testnet]
    D --> F[Update Contract Addresses]
    E --> F
    F --> G[Update RPC Endpoint]
    G --> H[Save Network Choice to localStorage]
    H --> I[Reload Application State]
    I --> J[Update UI Components]
    J --> K[Network Switch Complete]
    
    style A fill:#e1f5fe
    style K fill:#c8e6c9
    style F fill:#fff3e0
    style G fill:#fff3e0
    style H fill:#fff3e0
```

## 7. Transaction Sponsorship Flow

```mermaid
graph TD
    A[User Initiates Expensive Transaction] --> B[Calculate Gas Cost]
    B --> C{Is Gas Cost High?}
    C -->|No| D[Execute Normal Transaction]
    C -->|Yes| E[Check Server Balance]
    E --> F{Server Has Enough Balance?}
    F -->|No| G[Fund Server Wallet]
    G --> H[Wait for Funding Confirmation]
    H --> I[Relay Transaction from Server]
    F -->|Yes| I
    I --> J[Server Pays Gas Fees]
    J --> K[Transaction Executed]
    K --> L[User Receives Confirmation]
    
    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style G fill:#fff3e0
    style I fill:#fff3e0
    style J fill:#fff3e0
```

## 8. Guardian Management Flow

```mermaid
graph TD
    A[Wallet Owner Adds Guardian] --> B[Enter Guardian Address]
    B --> C[Validate Guardian Address]
    C --> D{Is Address Valid?}
    D -->|No| E[Show Invalid Address Error]
    D -->|Yes| E[Call Wallet Contract]
    E --> F[Add Guardian to Contract]
    F --> G[Guardian Added Event]
    G --> H[Update Local Guardian List]
    H --> I[Guardian Management Complete]
    
    I --> J[Guardian Can Initiate Recovery]
    J --> K[Enter New Owner Address]
    K --> L[Start Recovery Process]
    L --> M[2-Day Cooldown Begins]
    M --> N[Owner Can Cancel]
    N --> O[Cooldown Complete]
    O --> P[Complete Recovery]
    
    style A fill:#e1f5fe
    style I fill:#c8e6c9
    style P fill:#c8e6c9
    style E fill:#ffcdd2
    style F fill:#fff3e0
    style L fill:#fff3e0
```

## 9. Batch Transaction Flow

```mermaid
graph TD
    A[User Initiates Batch Transaction] --> B[Prepare Multiple Transactions]
    B --> C[Create Batch Hash]
    C --> D[Sign Batch with Private Key]
    D --> E[Submit Batch to Contract]
    E --> F[Contract Validates Signature]
    F --> G{Signature Valid?}
    G -->|No| H[Transaction Reverted]
    G -->|Yes| I[Execute Each Transaction in Batch]
    I --> J[All Transactions Complete]
    J --> K[Batch Execution Success]
    K --> L[Update Wallet State]
    
    style A fill:#e1f5fe
    style K fill:#c8e6c9
    style H fill:#ffcdd2
    style E fill:#fff3e0
    style I fill:#fff3e0
```

## 10. System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI]
        COMP[Components]
        PAGES[Pages]
        HOOKS[Custom Hooks]
    end
    
    subgraph "Service Layer"
        TS[Transaction Service]
        KS[Key Management]
        WS[Wallet Service]
        FS[Funding Service]
        NS[Name Service]
        SMS[Session Management]
    end
    
    subgraph "Smart Contract Layer"
        WF[Wallet Factory]
        WI[Wallet Implementation]
        WNS[WNS Registry]
        RM[Recovery Manager]
    end
    
    subgraph "Infrastructure"
        SB[Supabase DB]
        RELAY[Transaction Relayer]
        EMAIL[Email Service]
        STORAGE[Local Storage]
    end
    
    subgraph "Blockchain Networks"
        TESTNET[W-Chain Testnet<br/>Chain ID: 71117]
        MAINNET[W-Chain Mainnet<br/>Chain ID: 171717]
    end
    
    UI --> COMP
    COMP --> PAGES
    PAGES --> HOOKS
    
    UI --> TS
    UI --> KS
    UI --> WS
    UI --> FS
    UI --> NS
    UI --> SMS
    
    TS --> WF
    TS --> WI
    WS --> SB
    NS --> WNS
    FS --> RELAY
    SMS --> SB
    
    WF --> WI
    WI --> RM
    WNS --> WI
    
    TS --> TESTNET
    TS --> MAINNET
    RELAY --> TESTNET
    RELAY --> MAINNET
    
    KS --> STORAGE
    SMS --> STORAGE
```

## 11. Security Flow Overview

```mermaid
graph TD
    A[User Input] --> B[Input Validation]
    B --> C[Sanitization]
    C --> D[Encryption/Decryption]
    D --> E[Signature Verification]
    E --> F[Transaction Validation]
    F --> G[Gas Price Validation]
    G --> H[Network Validation]
    H --> I[Execution]
    I --> J[Event Logging]
    J --> K[State Update]
    
    style A fill:#e1f5fe
    style K fill:#c8e6c9
    style B fill:#fff3e0
    style C fill:#fff3e0
    style D fill:#fff3e0
    style E fill:#fff3e0
```

## 12. Error Handling Flow

```mermaid
graph TD
    A[Error Occurs] --> B[Error Classification]
    B --> C{Error Type?}
    C -->|Network Error| D[Retry with Backoff]
    C -->|Validation Error| E[Show User Message]
    C -->|Security Error| F[Log & Alert]
    C -->|Contract Error| G[Parse Contract Error]
    
    D --> H{Retry Successful?}
    H -->|Yes| I[Continue Operation]
    H -->|No| J[Show Error Message]
    
    E --> J[User Action Required]
    F --> K[Security Alert]
    G --> L[Show Contract Error]
    
    J --> M[User Corrects Input]
    K --> N[Security Review]
    L --> O[User Reviews Error]
    
    style A fill:#ffcdd2
    style I fill:#c8e6c9
    style J fill:#fff3e0
    style K fill:#ffcdd2
    style L fill:#fff3e0
```

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Purpose**: Comprehensive system flow documentation for W-Access platform
