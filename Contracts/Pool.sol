//SPDX-License-Identifier: MIT

pragma solidity 0.8.13; 

import "@openzeppelin/contracts/utils/Counters.sol";

contract Pool {
    
    string POOL_ID;
    string POOL_NAME;
    address PINSURANCE_ADRESS;

    constructor(string memory poolId, string memory poolName, address pinsuranceAddress) {
        POOL_ID = poolId;
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
        uint256 poolBalance;
        bool isActive; // when all user have joined --> memberCount = 3
    }

    poolDetail poolData;

    mapping(address => userPoolAccount) public userPoolAccountStatus;

    function getPoolBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function setUserMetadataURI(address userAddress, string memory _userMetadataURI) external {
        userPoolAccountStatus[userAddress].metadataURI = _userMetadataURI;
    }

    function getUserMetadatURI(address userAddress) public view returns(string memory) {
        return userPoolAccountStatus[userAddress].metadataURI;
    }

    function stakePremium(address userAddress) public {
        
    }
    // function setPoolData() external {
        
    // }  

    // function stakeAmount()
}