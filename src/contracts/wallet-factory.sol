// SPDX-License-Identifier: MIT
pragma solidity =0.8.3;

interface IWallet {
    function initialize(address _owner, string memory _name) external;
}

contract WalletFactory {
    address public immutable walletImplementation;
    
    event WalletCreated(address indexed wallet, address indexed owner, string name);
    
    constructor(address _implementation) {
        require(_implementation != address(0), "Invalid implementation");
        walletImplementation = _implementation;
    }
    
    function createWallet(string calldata _name) external returns (address) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        address clone = createClone(walletImplementation);
        IWallet(clone).initialize(msg.sender, _name);
        
        emit WalletCreated(clone, msg.sender, _name);
        return clone;
    }
    
    // EIP-1167 minimal proxy implementation
    function createClone(address target) internal returns (address result) {
        bytes20 targetBytes = bytes20(target);
        assembly {
            let clone := mload(0x40)
            mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(clone, 0x14), targetBytes)
            mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            result := create(0, clone, 0x37)
        }
        require(result != address(0), "Clone creation failed");
    }
    
    function predictWalletAddress(string calldata _name, address _owner) external view returns (address) {
        // This is a simple prediction - in practice you might want to use CREATE2 for deterministic addresses
        return address(uint160(uint256(keccak256(abi.encodePacked(_name, _owner, address(this))))));
    }
}