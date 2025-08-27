// SPDX-License-Identifier: MIT
pragma solidity =0.8.3;

contract WNSRegistry {
    mapping(string => address) public nameToAddress;
    mapping(address => string) public addressToName;
    
    event NameRegistered(string indexed name, address indexed wallet);
    event NameUpdated(string indexed oldName, string indexed newName, address indexed wallet);
    event NameTransferred(string indexed name, address indexed oldWallet, address indexed newWallet);
    event NameReleased(string indexed name, address indexed wallet);

    modifier validName(string calldata _name) {
        require(bytes(_name).length > 3, "Name too short");
        _;
    }

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }

    function registerName(string calldata _name, address _wallet) 
        external 
        validName(_name) 
        validAddress(_wallet) 
    {
        require(nameToAddress[_name] == address(0), "Name taken");
        
        // Clear existing name if wallet has one
        string memory existingName = addressToName[_wallet];
        if (bytes(existingName).length > 0) {
            delete nameToAddress[existingName];
        }
        
        nameToAddress[_name] = _wallet;
        addressToName[_wallet] = _name;
        
        emit NameRegistered(_name, _wallet);
    }
    
    function updateName(string calldata _newName) 
        external 
        validName(_newName) 
    {
        string memory oldName = addressToName[msg.sender];
        require(bytes(oldName).length > 0, "No name registered");
        require(nameToAddress[_newName] == address(0), "Name taken");
        
        delete nameToAddress[oldName];
        nameToAddress[_newName] = msg.sender;
        addressToName[msg.sender] = _newName;
        
        emit NameUpdated(oldName, _newName, msg.sender);
    }
    
    function transferName(address _newWallet) 
        external 
        validAddress(_newWallet) 
    {
        require(_newWallet != msg.sender, "Cannot transfer to self");
        
        string memory name = addressToName[msg.sender];
        require(bytes(name).length > 0, "No name registered");
        
        // Clear new wallet's existing name if any
        string memory existingName = addressToName[_newWallet];
        if (bytes(existingName).length > 0) {
            delete nameToAddress[existingName];
        }
        
        delete addressToName[msg.sender];
        nameToAddress[name] = _newWallet;
        addressToName[_newWallet] = name;
        
        emit NameTransferred(name, msg.sender, _newWallet);
    }
    
    function releaseName() external {
        string memory name = addressToName[msg.sender];
        require(bytes(name).length > 0, "No name registered");
        
        delete nameToAddress[name];
        delete addressToName[msg.sender];
        
        emit NameReleased(name, msg.sender);
    }
    
    function isNameAvailable(string calldata _name) external view returns (bool) {
        return nameToAddress[_name] == address(0);
    }
    
    function getNameOwner(string calldata _name) external view returns (address) {
        return nameToAddress[_name];
    }
    
    function getAddressName(address _wallet) external view returns (string memory) {
        return addressToName[_wallet];
    }
}