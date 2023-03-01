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

    poolDetail poolData; 

    struct userClaim {
        address userAddress;
        uint claimAmount;
        bool isApproved; // false
        uint voteCount; // 0
        mapping(address => bool) poolMembersApprovalStatus;
        bool claimed; // false
    }

    mapping(address => userPoolAccount) userPoolAccountStatus;

    mapping(address => userClaim ) userClaimDetails;

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

    function createClaimRequest(address _userAddress, string memory docUri, uint amount) public {

        if (isUserMember(_userAddress)) {
           
            claimCount.increment();
            
            userClaimDetails[_userAddress].claimAmount = amount;
    
            // now call the pinsurance contract to create a new claim request.
            Pinsurance  pinsuranceContract = Pinsurance(PINSURANCE_ADRESS);
            pinsuranceContract.createClaim(_userAddress, address(this), docUri, POOL_NAME, amount);

        }
       
    }

    function approveClaim(address claimerAddress) public {

        userClaim storage currentClaim = userClaimDetails[claimerAddress];
        require(!currentClaim.poolMembersApprovalStatus[msg.sender],'Already approved!');
        currentClaim.poolMembersApprovalStatus[msg.sender] = true;
        currentClaim.voteCount++;

        if (currentClaim.voteCount > (poolMembers.length)/2 ) {
            currentClaim.isApproved = true;
        }

    }

    function declineClaim(address claimerAddress) public {
        userClaimDetails[claimerAddress].poolMembersApprovalStatus[msg.sender] = false;
    }

    function getClaimStatus(address userAddress) public view returns(bool) {
        return userClaimDetails[userAddress].isApproved;
    }

   
    // check if user is member of given pool or not.
    function isUserMember(address userAddress) public view returns(bool) {
        require((poolData.isActive && userPoolAccountStatus[userAddress].haveStaked),'Premium not staked!');
        return userPoolAccountStatus[userAddress].haveStaked;
    }

    // this one gonna be challenging!
    function claimFund() public {
        require(userClaimDetails[msg.sender].isApproved,'Claim not approved yet!');
        require(!userClaimDetails[msg.sender].claimed,'Already claimed!');
        payable(msg.sender).transfer(userClaimDetails[msg.sender].claimAmount);
        userClaimDetails[msg.sender].claimed = true;
    }

    function getMemberApprovalStatus(address claimerAddress) public view returns(bool) {
        return userClaimDetails[claimerAddress].poolMembersApprovalStatus[msg.sender];
    }

    receive() external payable {}

    fallback() external payable {}

}