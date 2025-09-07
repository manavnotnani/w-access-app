// SPDX-License-Identifier: MIT
pragma solidity =0.8.3;

// Minimal ECDSA library implementation for 0.8.3 compatibility
library ECDSA {
    function recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
        if (signature.length != 65) {
            return address(0);
        }
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }
        
        return ecrecover(hash, v, r, s);
    }
    
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}

// Minimal ERC-1271 interface
interface IERC1271 {
    function isValidSignature(bytes32 hash, bytes memory signature) external view returns (bytes4 magicValue);
}

contract WalletImplementation is IERC1271 {
    using ECDSA for bytes32;
    
    // Constants
    bytes4 constant internal MAGICVALUE = 0x1626ba7e;
    bytes4 constant internal INVALID_SIGNATURE = 0xffffffff;
    uint256 constant public RECOVERY_COOLDOWN = 2 days;
    uint256 constant public MAX_GUARDIANS = 10;
    
    // Wallet state
    address public owner;
    string public name;
    uint256 public nonce;
    bool private initialized;
    
    // Recovery state
    address[] public guardians;
    uint256 public recoveryInitiatedAt;
    address public pendingNewOwner;

    // Events
    event Initialized(address indexed owner, string name);
    event Deposit(address indexed sender, uint256 amount);
    event ExecutionSuccess(bytes32 indexed txHash, address indexed to, uint256 value);
    event ExecutionFailure(bytes32 indexed txHash, string reason);
    event RecoveryInitiated(address indexed newOwner, address indexed guardian);
    event RecoveryCompleted(address indexed oldOwner, address indexed newOwner);
    event GuardianAdded(address indexed guardian);
    event GuardianRemoved(address indexed guardian);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }

    // Initialize acts as constructor for proxies
    function initialize(address _owner, string memory _name) external {
        require(!initialized, "Already initialized");
        require(_owner != address(0), "Invalid owner");
        require(bytes(_name).length > 0, "Invalid name");
        
        owner = _owner;
        name = _name;
        nonce = 0;
        initialized = true;
        
        // Add owner as first guardian
        guardians.push(_owner);
        
        emit Initialized(_owner, _name);
        emit GuardianAdded(_owner);
    }

    // Main execute function with better error handling
    function execute(
        address dest,
        uint256 value,
        bytes calldata func,
        bytes calldata signature
    ) external returns (bytes memory) {
        require(dest != address(0), "Invalid destination");
        
        bytes32 txHash = keccak256(
            abi.encodePacked(
                block.chainid,
                address(this),
                dest,
                value,
                func,
                nonce++
            )
        ).toEthSignedMessageHash();
        
        address signer = txHash.recover(signature);
        require(signer == owner, "Invalid signature");
        
        (bool success, bytes memory result) = dest.call{value: value}(func);
        
        if (success) {
            emit ExecutionSuccess(txHash, dest, value);
            return result;
        } else {
            emit ExecutionFailure(txHash, "Call failed");
            revert("Execution failed");
        }
    }

    // Batch execute for multiple transactions
    function executeBatch(
        address[] calldata destinations,
        uint256[] calldata values,
        bytes[] calldata functionCalls,
        bytes calldata signature
    ) external returns (bytes[] memory results) {
        require(destinations.length == values.length, "Length mismatch");
        require(destinations.length == functionCalls.length, "Length mismatch");
        require(destinations.length > 0, "Empty batch");
        
        bytes32 batchHash = keccak256(
            abi.encode(
                block.chainid,
                address(this),
                destinations,
                values,
                functionCalls,
                nonce++
            )
        ).toEthSignedMessageHash();
        
        address signer = batchHash.recover(signature);
        require(signer == owner, "Invalid signature");
        
        results = new bytes[](destinations.length);
        
        for (uint256 i = 0; i < destinations.length; i++) {
            require(destinations[i] != address(0), "Invalid destination");           
            (bool success, bytes memory result) = destinations[i].call{value: values[i]}(functionCalls[i]);
            
            if (success) {
                results[i] = result;
                emit ExecutionSuccess(batchHash, destinations[i], values[i]);
            } else {
                emit ExecutionFailure(batchHash, "Batch call failed");
                revert("Batch execution failed");
            }
        }
    }

    // ERC-1271 Signature Validation
    function isValidSignature(
        bytes32 hash,
        bytes memory signature
    ) external view override returns (bytes4 magicValue) {
        return hash.recover(signature) == owner ? MAGICVALUE : INVALID_SIGNATURE;
    }

    // Recovery Functions with better validation
    function initiateRecovery(address newOwner) external validAddress(newOwner) {
        require(isGuardian(msg.sender), "Not guardian");
        require(newOwner != owner, "Same as current owner");
        require(recoveryInitiatedAt == 0, "Recovery already initiated");
        
        pendingNewOwner = newOwner;
        recoveryInitiatedAt = block.timestamp;
        
        emit RecoveryInitiated(newOwner, msg.sender);
    }

    function completeRecovery() external {
        require(recoveryInitiatedAt > 0, "No recovery initiated");
        require(
            block.timestamp >= recoveryInitiatedAt + RECOVERY_COOLDOWN,
            "Cooldown active"
        );
        
        address oldOwner = owner;
        owner = pendingNewOwner;
        
        // Reset recovery state
        recoveryInitiatedAt = 0;
        pendingNewOwner = address(0);
        
        emit RecoveryCompleted(oldOwner, owner);
    }

    function cancelRecovery() external onlyOwner {
        require(recoveryInitiatedAt > 0, "No recovery to cancel");
        
        recoveryInitiatedAt = 0;
        pendingNewOwner = address(0);
    }

    // Guardian Management with limits
    function addGuardian(address guardian) external onlyOwner validAddress(guardian) {
        require(!isGuardian(guardian), "Already guardian");
        require(guardians.length < MAX_GUARDIANS, "Too many guardians");
        
        guardians.push(guardian);
        emit GuardianAdded(guardian);
    }

    function removeGuardian(address guardian) external onlyOwner {
        require(guardians.length > 1, "Cannot remove last guardian");
        
        for (uint256 i = 0; i < guardians.length; i++) {
            if (guardians[i] == guardian) {
                guardians[i] = guardians[guardians.length - 1];
                guardians.pop();
                emit GuardianRemoved(guardian);
                return;
            }
        }
        revert("Guardian not found");
    }

    // View functions
    function isGuardian(address addr) public view returns (bool) {
        for (uint256 i = 0; i < guardians.length; i++) {
            if (guardians[i] == addr) {
                return true;
            }
        }
        return false;
    }

    function getGuardians() external view returns (address[] memory) {
        return guardians;
    }

    function getGuardianCount() external view returns (uint256) {
        return guardians.length;
    }

    function isRecoveryActive() external view returns (bool) {
        return recoveryInitiatedAt > 0;
    }

    function getRecoveryTimeRemaining() external view returns (uint256) {
        if (recoveryInitiatedAt == 0) return 0;
        
        uint256 deadline = recoveryInitiatedAt + RECOVERY_COOLDOWN;
        if (block.timestamp >= deadline) return 0;
        
        return deadline - block.timestamp;
    }

    // Required for receiving ETH
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
    
    fallback() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}