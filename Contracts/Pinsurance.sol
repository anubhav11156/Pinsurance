//SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./Pool.sol";

contract Pinsurance {

    using Counters for Counters.Counter;
    Counters.Counter public userCount;
    Counters.Counter public poolCount;

    address OWNER;

    constructor() {
        OWNER = msg.sender;
    }

    // User account data
    struct userAccount {
        address userAddress;
        string userMetadataURI; // -> name, profileImage, age, emailId
        bool userAccountStatus; 
        address[] userAssociatedPools;
    }

    // user account detail mapping
    mapping(address => userAccount) userAddressTouserAccount;

    // Pool data  ---> set pool member limit to 3 for demo purpose
    struct poolDetail {
        address poolContractAddress;        
        uint256 currentMemberCount;
        address[] members;
        uint claimCounter;
    }

    // structure for claim notification
    struct userClaim {
        userAccount userDetail;
        address poolAddress;
        string supportDocumentCID;
        string poolName;
        uint claimAmount;
    }

    userClaim[] public claims; // array of all claim requests.

    // user address -> pool address => is member or not
    mapping(address => mapping(address => bool)) userToPoolMembership;

    mapping(address => poolDetail) poolAddressToPoolDetail;

    // mapping(string => address) poolAddressToPoolStatus;
    mapping(address => bool) poolAddressToStatus;   // true -> pool exists, false -> dosen't exists.


    // function to create user account | creation of user will be free and platform will pay the gas fees.
    function createUser(
        address _userAddress,
        string memory _userMetadataURI
    ) public {
        userAccount storage currentUser = userAddressTouserAccount[_userAddress];
        currentUser.userAddress = _userAddress;  
        currentUser.userMetadataURI = _userMetadataURI;
        currentUser.userAccountStatus = true;
        userCount.increment();
    }

    /// getters =>

    function getUserAccountStatus(address userAddress) public view returns(bool){
        return userAddressTouserAccount[userAddress].userAccountStatus;
    }

    function getUserDetail(address userAddress) public view returns(userAccount memory) {
        return userAddressTouserAccount[userAddress];
    }


    function getPoolStatus(address poolAddress) public view returns(bool){
        return poolAddressToStatus[poolAddress];
    }

    function getPoolMembers(address poolAddress) public view returns(userAccount[] memory){
       // will return account information of users of given poolAddress.
       require(poolAddressToPoolDetail[poolAddress].currentMemberCount>0,'No member in this pool.');
       uint256 memberCount = poolAddressToPoolDetail[poolAddress].currentMemberCount;
       uint256 currentIndex = 0;

       // array to store poolMembers account information.
       userAccount[] memory poolMembers = new userAccount[](memberCount);

       for(uint i=0; i<memberCount; i++) {
           address userAddress = poolAddressToPoolDetail[poolAddress].members[i];
           userAccount storage currentUser = userAddressTouserAccount[userAddress];
           poolMembers[currentIndex] = currentUser;
           currentIndex++;
       }

       return poolMembers;
    }

    function getUserAllPools(address userAddress) public view returns(poolDetail[] memory){
        uint256 numberOfPools = userAddressTouserAccount[userAddress].userAssociatedPools.length;
        uint256 currentIndex = 0;

        poolDetail[] memory userPools = new poolDetail[](numberOfPools);

        for(uint i=0; i<numberOfPools; i++) {
            address poolAddress = userAddressTouserAccount[userAddress].userAssociatedPools[i];
            poolDetail storage currentPool = poolAddressToPoolDetail[poolAddress];
            userPools[currentIndex] = currentPool;
            currentIndex++;
        }

        return userPools;
    }

    // get claim-requests if part of any pool.
    function getClaimRequests(address userAddress) public view returns(userClaim[] memory) {
 
        uint currentIndex = 0;
        uint userAsscociatedClaimCounter=0;

        for(uint i=0; i<userAddressTouserAccount[userAddress].userAssociatedPools.length; i++) {
            userAsscociatedClaimCounter += poolAddressToPoolDetail[userAddressTouserAccount[userAddress].userAssociatedPools[i]].claimCounter;
        }

        userClaim[] memory claimArray = new userClaim[](userAsscociatedClaimCounter); 

        for(uint i=0; i<claims.length; i++) {
            if(userToPoolMembership[userAddress][claims[i].poolAddress] == true) {
                claimArray[currentIndex] = claims[i];
                currentIndex++; 
            }
        }

        return claimArray;
    }

    /// 
    

    // Fee: $100 
    function createPool(string memory poolName, string memory metadataURI, address userAddress) public {
        require(userAddressTouserAccount[userAddress].userAccountStatus==true,'Create account first.');

        address payable newPool = payable(new Pool(poolName, address(this))); // returns address of the new pool.

        // poolAddressToPoolDetail[newPool].poolAddress = poolAddress;
        poolAddressToStatus[newPool] = true;
        poolAddressToPoolDetail[newPool].poolContractAddress = newPool;
        userAddressTouserAccount[userAddress].userAssociatedPools.push(newPool);
        poolAddressToPoolDetail[newPool].members.push(userAddress);
        poolAddressToPoolDetail[newPool].currentMemberCount++;
        

        userToPoolMembership[userAddress][newPool]=true; // for membership

        Pool  poolContract = Pool(newPool);
        poolContract.setUserMetadataURI(userAddress, metadataURI);

        poolCount.increment();
    }

    // Fee: $100

    function joinPool(address poolAddress, address userAddress, string memory metadataURI) public {
        require(userAddressTouserAccount[userAddress].userAccountStatus==true,'Create account first.');
        require(poolAddressToStatus[poolAddress] == true,'No pool found  with given poolAddress');

        uint256 empty = (3 - poolAddressToPoolDetail[poolAddress].members.length);

        require((empty >= 1),'Not enough slot in the pool.');

        userToPoolMembership[userAddress][poolAddressToPoolDetail[poolAddress].poolContractAddress]=true; // for membership
        poolAddressToPoolDetail[poolAddress].currentMemberCount++;
        userAddressTouserAccount[userAddress].userAssociatedPools.push(poolAddress);
        poolAddressToPoolDetail[poolAddress].members.push(userAddress);

        Pool poolContract = Pool(payable(poolAddress));
        poolContract.setUserMetadataURI(userAddress, metadataURI);
    }

    // create claim request
    function createClaim(address claimerAddress, address _poolAddress, string memory docURI, string memory _poolName, uint amount) external {

        userClaim memory newClaim;

        newClaim.userDetail = userAddressTouserAccount[claimerAddress];
        newClaim.poolAddress = _poolAddress;
        newClaim.supportDocumentCID = docURI;
        newClaim.poolName = _poolName;
        newClaim.claimAmount = amount;
        claims.push(newClaim);

        poolAddressToPoolDetail[_poolAddress].claimCounter++;

    }

}