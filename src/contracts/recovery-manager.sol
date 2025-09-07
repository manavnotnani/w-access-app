// SPDX-License-Identifier: MIT
pragma solidity =0.8.3;

interface IWallet {
    function owner() external view returns (address);
    function transferOwnership(address newOwner) external;
    function isGuardian(address guardian) external view returns (bool);
}

contract RecoveryManager {
    struct RecoveryRequest {
        address newOwner;
        uint256 unlockTime;
        address initiator;
        bool executed;
        bool canceled;
    }
    
    uint256 public constant RECOVERY_DELAY = 2 days;
    uint256 public constant MIN_GUARDIANS_REQUIRED = 1;
    
    mapping(address => RecoveryRequest) public recoveryRequests;
    mapping(address => address[]) public walletGuardians;
    mapping(address => mapping(address => bool)) public isWalletGuardian;
    
    event RecoveryInitiated(address indexed wallet, address indexed newOwner, address indexed initiator, uint256 unlockTime);
    event RecoveryCanceled(address indexed wallet, address indexed canceledBy);
    event RecoveryCompleted(address indexed wallet, address indexed oldOwner, address indexed newOwner);
    event GuardianAdded(address indexed wallet, address indexed guardian);
    event GuardianRemoved(address indexed wallet, address indexed guardian);
    
    modifier onlyWalletOwner(address wallet) {
        require(msg.sender == IWallet(wallet).owner(), "Not wallet owner");
        _;
    }
    
    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }
    
    function addGuardian(address wallet, address guardian) 
        external 
        onlyWalletOwner(wallet) 
        validAddress(guardian) 
    {
        require(!isWalletGuardian[wallet][guardian], "Already guardian");
        require(guardian != IWallet(wallet).owner(), "Owner cannot be guardian");
        
        walletGuardians[wallet].push(guardian);
        isWalletGuardian[wallet][guardian] = true;
        
        emit GuardianAdded(wallet, guardian);
    }
    
    function removeGuardian(address wallet, address guardian) 
        external 
        onlyWalletOwner(wallet) 
    {
        require(isWalletGuardian[wallet][guardian], "Not a guardian");
        require(walletGuardians[wallet].length > MIN_GUARDIANS_REQUIRED, "Cannot remove last guardian");
        
        // Find and remove guardian
        address[] storage guardians = walletGuardians[wallet];
        for (uint256 i = 0; i < guardians.length; i++) {
            if (guardians[i] == guardian) {
                guardians[i] = guardians[guardians.length - 1];
                guardians.pop();
                break;
            }
        }
        
        isWalletGuardian[wallet][guardian] = false;
        emit GuardianRemoved(wallet, guardian);
    }
    
    function initiateRecovery(address wallet, address newOwner) 
        external 
        validAddress(wallet)
        validAddress(newOwner)
    {
        require(isWalletGuardian[wallet][msg.sender], "Not guardian");
        require(newOwner != IWallet(wallet).owner(), "Same as current owner");
        
        RecoveryRequest storage existingRequest = recoveryRequests[wallet];
        require(!existingRequest.executed, "Recovery already executed");
        require(existingRequest.canceled || existingRequest.unlockTime == 0, "Recovery already active");
        
        uint256 unlockTime = block.timestamp + RECOVERY_DELAY;
        
        recoveryRequests[wallet] = RecoveryRequest({
            newOwner: newOwner,
            unlockTime: unlockTime,
            initiator: msg.sender,
            executed: false,
            canceled: false
        });
        
        emit RecoveryInitiated(wallet, newOwner, msg.sender, unlockTime);
    }
    
    function cancelRecovery(address wallet) external {
        RecoveryRequest storage request = recoveryRequests[wallet];
        require(request.unlockTime > 0, "No active recovery");
        require(!request.executed, "Recovery already executed");
        require(!request.canceled, "Recovery already canceled");
        
        // Either wallet owner or the guardian who initiated can cancel
        bool canCancel = (msg.sender == IWallet(wallet).owner()) || 
                        (msg.sender == request.initiator);
        require(canCancel, "Not authorized to cancel");
        
        request.canceled = true;
        emit RecoveryCanceled(wallet, msg.sender);
    }
    
    function completeRecovery(address wallet) external {
        RecoveryRequest storage request = recoveryRequests[wallet];
        require(request.unlockTime > 0, "No recovery request");
        require(block.timestamp >= request.unlockTime, "Recovery period not elapsed");
        require(!request.executed, "Already executed");
        require(!request.canceled, "Recovery canceled");
        
        // Anyone can complete a valid recovery (usually the new owner or a guardian)
        address oldOwner = IWallet(wallet).owner();
        
        // Mark as executed before external call to prevent reentrancy
        request.executed = true;
        
        // Transfer ownership through the wallet contract
        IWallet(wallet).transferOwnership(request.newOwner);
        
        emit RecoveryCompleted(wallet, oldOwner, request.newOwner);
    }
    
    // View functions
    function getGuardians(address wallet) external view returns (address[] memory) {
        return walletGuardians[wallet];
    }
    
    function getGuardianCount(address wallet) external view returns (uint256) {
        return walletGuardians[wallet].length;
    }
    
    function isGuardianOf(address wallet, address guardian) external view returns (bool) {
        return isWalletGuardian[wallet][guardian];
    }
    
    function getRecoveryRequest(address wallet) 
        external 
        view 
        returns (
            address newOwner,
            uint256 unlockTime,
            address initiator,
            bool executed,
            bool canceled,
            uint256 timeRemaining
        ) 
    {
        RecoveryRequest memory request = recoveryRequests[wallet];
        uint256 remaining = 0;
        
        if (request.unlockTime > block.timestamp && !request.executed && !request.canceled) {
            remaining = request.unlockTime - block.timestamp;
        }
        
        return (
            request.newOwner,
            request.unlockTime,
            request.initiator,
            request.executed,
            request.canceled,
            remaining
        );
    }
    
    function isRecoveryActive(address wallet) external view returns (bool) {
        RecoveryRequest memory request = recoveryRequests[wallet];
        return request.unlockTime > 0 && 
               !request.executed && 
               !request.canceled;
    }
}