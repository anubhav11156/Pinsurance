//SPDX-License-Identifier: MIT

pragma solidity 0.8.13; 

import "@openzeppelin/contracts/utils/Counters.sol";
import "./Pinsurance.sol";

contract Pool {
    
    string POOL_NAME;
    address PINSURANCE_ADRESS;

    constructor(string memory poolName, address pinsuranceAddress) {
        POOL_NAME = poolName;
        PINSURANCE_ADRESS = pinsuranceAddress;
    }

    using Counters for Counters.Counter;
    Counters.Counter public claimCount;


    address[] poolMembers;

    address[] membersWhoClaimed;

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

    mapping(address => userPoolAccount) userPoolAccountStatus;


    struct claim {
        address userAddress;
        address poolAddress;
        string claimAmount;
        string docURI;
        bool claimStatus;
    }

    mapping(address => claim ) userClaimRequests;

    mapping(address => bool) userClaimStatus;

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }


    function getStakeStatus(address userAddress) public view returns(bool){
        return userPoolAccountStatus[userAddress].haveStaked;
    }

    function setUserMetadataURI(address userAddress, string memory _userMetadataURI) external {
        userPoolAccountStatus[userAddress].metadataURI = _userMetadataURI;
        poolMembers.push(userAddress);

        if(poolMembers.length==1){
           poolData.name = POOL_NAME;
        }
    }

    function getUserMetadatURI(address userAddress) public view returns(string memory) {
        return userPoolAccountStatus[userAddress].metadataURI;
    }

    function stake(address userAddress, string memory amount) public {
        userPoolAccountStatus[userAddress].haveStaked = true;
        userPoolAccountStatus[userAddress].amountStaked = amount;

        if(poolMembers.length==2){ // means all user have staked their amount
            poolData.isActive=true;
            poolData.from = block.timestamp;
            poolData.to = poolData.from + 31536000; // after one year
        }
    }

    function getPoolDetail() public view returns(poolDetail memory) {
        return poolData;
    }

    function createClaimRequest(address _userAddress, string memory docUri, string memory amount) public {

        if (isUserMember(_userAddress)) {
            userClaimRequests[_userAddress].userAddress = _userAddress;
            userClaimRequests[_userAddress].docURI = docUri;
            userClaimRequests[_userAddress].claimAmount = amount;
            membersWhoClaimed.push(_userAddress);
            claimCount.increment();

            // now call the pinsurance contract to create a new claim request.

            Pinsurance  pinsuranceContract = Pinsurance(PINSURANCE_ADRESS);
            pinsuranceContract.createClaim(_userAddress, address(this), docUri, POOL_NAME);
            
        }
       
    }

    function approveClaim(address claimerAddress) public {
        require(claimerAddress != msg.sender,'Only other members can approve claim.');
        userClaimStatus[claimerAddress] = true;
    }

    function fetchAllClaims() public view returns(claim[] memory) {
        // returns all claim as array
        uint cCount = claimCount.current();
        uint currentIndex = 0;

        claim[] memory allClaims = new claim[](cCount);

        for(uint i=0; i<cCount; i++){
            claim storage currentClaim = userClaimRequests[membersWhoClaimed[i]];
            allClaims[currentIndex] = currentClaim;
            currentIndex++;
        }

        return allClaims;

    }

    // check if user is member of given pool or not.
    function isUserMember(address userAddress) public view returns(bool) {
        require((poolData.isActive && userPoolAccountStatus[userAddress].haveStaked),'Premium not staked!');
        return userPoolAccountStatus[userAddress].haveStaked;
    }

    receive() external payable {}

    fallback() external payable {}

}