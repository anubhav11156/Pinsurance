//SPDX-License-Identifier: MIT

pragma solidity 0.8.13; 

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Pinsurance.sol";

contract Pool {
    
    string POOL_NAME;
    address PINSURANCE_ADDRESS;
    address FAKE_USDC_ADDRESS;

    constructor(string memory poolName, address pinsuranceAddress) {
        POOL_NAME = poolName;
        PINSURANCE_ADDRESS = pinsuranceAddress;
        FAKE_USDC_ADDRESS = 0xF8E9F063228eb47137101eb863BF3976466AA31F;
    }

    IERC20 usdc = IERC20(FAKE_USDC_ADDRESS); //usdt contract

    using Counters for Counters.Counter;
    Counters.Counter public claimCount;


    address[] poolMembers;

    struct userPoolAccount {
        string amountStaked;
        bool haveStaked;
        string metadataURI;
        string txHash;
    }

    struct poolDetail {
        uint256 from; // unix timestamp
        uint256 to;   // unix timestamp
        bool isActive; // when all user have joined --> memberCount = 3 -> for demo purpose
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

    function stake(address userAddress, string memory amount, string memory txHash) public {
        require(!userPoolAccountStatus[userAddress].haveStaked,'Already Staked!');
        userPoolAccountStatus[userAddress].haveStaked = true;
        userPoolAccountStatus[userAddress].amountStaked = amount;
        userPoolAccountStatus[userAddress].txHash = txHash;

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
            Pinsurance  pinsuranceContract = Pinsurance(PINSURANCE_ADDRESS);
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

    function claimFund(uint256 amount) public {
        // require((block.timestamp > poolData.from)&&(block.timestamp < poolData.to),'Claim request not in pool period!');
        // require(userClaimDetails[msg.sender].isApproved,'Claim not approved yet!');
        // require(!userClaimDetails[msg.sender].claimed,'Already claimed!');

        address user = msg.sender;
 
        // uint poolBalance = usdc.balanceOf(address(this));
        // require(poolBalance>amount,'Insufficient pool balance');

        // approve and then transfer
        usdc.approve(address(this), amount);
        usdc.transferFrom(address(this), user, amount);
        userClaimDetails[msg.sender].claimed = true;
    }

    function getMemberApprovalStatus(address claimerAddress) public view returns(bool) {
        return userClaimDetails[claimerAddress].poolMembersApprovalStatus[msg.sender];
    }

    function getUserStakeTxHash(address userAddress) public view returns(string memory) {
        return userPoolAccountStatus[userAddress].txHash;
    }

    
    receive() external payable {}

    fallback() external payable {}
}