//SPDX-License-Identifier: MIT

pragma solidity 0.8.13; 

import "@openzeppelin/contracts/utils/Counters.sol";

contract Pool {
    
    string POOL_NAME;
    address PINSURANCE_ADRESS;

    constructor(string memory poolName, address pinsuranceAddress) {
        POOL_NAME = poolName;
        PINSURANCE_ADRESS = pinsuranceAddress;
    }

    using Counters for Counters.Counter;


    address[] poolMembers;


    struct userPoolAccount {
        string amountStaked;
        bool haveStaked;
        string metadataURI;
    }

    struct poolDetail {
        uint256 from; // unix timestamp
        uint256 to;   // unix timestamp
        bool isActive; // when all user have joined --> memberCount = 2 -> for demo purpose
        string name;
    }

    poolDetail poolData; // single variable to store pool information, simply returns this

    mapping(address => userPoolAccount) public userPoolAccountStatus;

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }


    function getStakeStatus(address userAddress) public view returns(bool){
        return userPoolAccountStatus[userAddress].haveStaked;
    }

    function setUserMetadataURI(address userAddress, string memory _userMetadataURI) external {
        userPoolAccountStatus[userAddress].metadataURI = _userMetadataURI;
        poolMembers.push(userAddress);
    }

    function getUserMetadatURI(address userAddress) public view returns(string memory) {
        return userPoolAccountStatus[userAddress].metadataURI;
    }

    function stake(address userAddress, string memory amount) public {
        userPoolAccountStatus[userAddress].haveStaked = true;
        userPoolAccountStatus[userAddress].amountStaked = amount;

        if(poolMembers.length==1){
            poolData.name = POOL_NAME;
        }

        if(poolMembers.length==2){ // means all user have staked their amount
            poolData.isActive=true;
            poolData.from = block.timestamp;
            poolData.to = poolData.from + 31536000; // after one year
        }
    }

    function getPoolDetail() public view returns(poolDetail memory) {
        return poolData;
    }

}