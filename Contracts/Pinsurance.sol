//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

import "./Pool.sol";
import "./MockUSDC.sol";

contract Pinsurance {

    using Counters for Counters.Counter;
    Counters.Counter public userCount;
    Counters.Counter public poolCount;

    address OWNER;

    constructor() {
        OWNER = msg.sender;
    }

    // address[] listOfUsers; // total number of users on pinsurance
    // address[] listOfPools; // total number of pools on pinsurance

    bytes16 private constant _SYMBOLS = "0123456789abcdef"; // for converting address to string

    // User account data
    struct userAccount {
        address userAddress;
        string userMetadataURI; // -> name, profileImage, age, emailId
        bool userAccountStatus; 
        string[] userAssociatedPools;
    }

    // user account detail mapping
    mapping(address => userAccount) userAddressTouserAccount;

    // Pool data  ---> set pool member limit to 2 for demo purpose
    struct poolDetail {
        string poolID;
        address poolContractAddress;        
        uint256 currentMemberCount;
        address[] members;
        bool poolExists;
    }

    // user address -> pool address => is member or not
    mapping(address => mapping(address => bool)) userToPoolMembership;

    // naonid to pooldetail mapping | nanoid will be a string. | paid
    mapping(string => poolDetail) poolIdToPoolDetail;

    // function getUsdcBalance() public view returns(uint256) {
    //     FakeUSDC usdc = FakeUSDC(FUSDC_CONTRACT_ADDRESS);
    //     return usdc.balanceOf(msg.sender);
    // }

    // function getOwnerBalance() public view returns(uint256) {
    //     FakeUSDC usdc = FakeUSDC(FUSDC_CONTRACT_ADDRESS);
    //     require(msg.sender == OWNER, 'You are not the onwer.');
    //     return usdc.balanceOf(OWNER);
    // }

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

    function getUserAccountStatus(address userAddress) public view returns(bool){
        return userAddressTouserAccount[userAddress].userAccountStatus;
    }

    // function to get user account detail 
    function getUserDetail(address userAddress) public view returns(userAccount memory) {
        return userAddressTouserAccount[userAddress];
    }



    // function to create pool | Fee: $100 
    function createPool(string memory poolId, string memory poolName, string memory metadataURI, address userAddress) public returns(address){
        require(userAddressTouserAccount[userAddress].userAccountStatus==true,'Create account first.');

        address newPool = address(new Pool(poolId, poolName, address(this))); // returns address of the new pool.

        poolIdToPoolDetail[poolId].poolID = poolId;
        poolIdToPoolDetail[poolId].poolExists = true;
        poolIdToPoolDetail[poolId].poolContractAddress = newPool;
        userAddressTouserAccount[userAddress].userAssociatedPools.push(poolId);
        poolIdToPoolDetail[poolId].members.push(userAddress);
        poolIdToPoolDetail[poolId].currentMemberCount++;
        
        userToPoolMembership[userAddress][newPool]=true; // for membership

        Pool poolContract = Pool(newPool);
        poolContract.setUserMetadataURI(userAddress, metadataURI);

        poolCount.increment();
        
        return newPool;
    }

    // function to join pool | Fee: $100 
    function joinPool(string memory poolId, address userAddress, string memory metadataURI) public {
        require(userAddressTouserAccount[userAddress].userAccountStatus==true,'Create account first.');
        require(poolIdToPoolDetail[poolId].poolExists==true,'No pool found  with given poolID');

        uint256 empty = (2 - poolIdToPoolDetail[poolId].members.length);

        require((empty > 1) || (empty == 1),'Not enough slot in the pool.');

        userToPoolMembership[userAddress][poolIdToPoolDetail[poolId].poolContractAddress]=true; // for membership
        poolIdToPoolDetail[poolId].currentMemberCount++;
        userAddressTouserAccount[userAddress].userAssociatedPools.push(poolId);
        poolIdToPoolDetail[poolId].members.push(userAddress);

        Pool poolContract = Pool(poolIdToPoolDetail[poolId].poolContractAddress);
        poolContract.setUserMetadataURI(userAddress, metadataURI);
    }

    function testingConcept(string memory poolId, address _userAddress) public view returns(string memory) {
        Pool poolContract = Pool(poolIdToPoolDetail[poolId].poolContractAddress);
        return poolContract.getUserMetadatURI(_userAddress);
    }

    function getPoolStatus(string memory poolId) public view returns(bool){
        return poolIdToPoolDetail[poolId].poolExists;
    }

    function getPoolContractAddress(string memory poolId) public view returns(address) {
        // check if pool exists
        require(poolIdToPoolDetail[poolId].poolExists == true,'No pool found with given poolId.');
        return poolIdToPoolDetail[poolId].poolContractAddress;
    }

    // fetches user account details of given poolId.
    function getPoolMembers(string memory poolId) public view returns(userAccount[] memory){
        // will return account information of users of given poolId.
        require(poolIdToPoolDetail[poolId].currentMemberCount>0,'No member in this pool.');
        uint256 memberCount = poolIdToPoolDetail[poolId].currentMemberCount;
        uint256 currentIndex = 0;

        // array to store poolMembers account information.
        userAccount[] memory poolMembers = new userAccount[](memberCount);

        for(uint i=0; i<memberCount; i++) {
            address userAddress = poolIdToPoolDetail[poolId].members[i];
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
            string memory poolId = userAddressTouserAccount[userAddress].userAssociatedPools[i];
            poolDetail storage currentPool = poolIdToPoolDetail[poolId];
            userPools[currentIndex] = currentPool;
            currentIndex++;
        }
        
        return userPools;
    }

    // Utils => 

    /* 
    function toHexString(uint256 value, uint256 length) private pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    function addressToHexString(address addr) private pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), 20);
    }

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
    */ 


}