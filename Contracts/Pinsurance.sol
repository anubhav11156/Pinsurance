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

    bytes16 private constant _SYMBOLS = "0123456789abcdef"; // for converting address to string

    // User account data
    struct userAccount {
        address userAddress;
        string userMetadataURI; // -> name, profileImage, age, emailId
        bool userAccountStatus; 
        address[] userAssociatedPools;
    }

    // user account detail mapping
    mapping(address => userAccount) userAddressTouserAccount;

    // Pool data  ---> set pool member limit to 2 for demo purpose
    struct poolDetail {
        address poolContractAddress;        
        uint256 currentMemberCount;
        address[] members;
    }

    // user address -> pool address => is member or not
    mapping(address => mapping(address => bool)) userToPoolMembership;

    mapping(address => poolDetail) poolAddressToPoolDetail;

    // mapping(string => address) poolAddressToPoolAddress;
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

    // function to get user account detail 
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

    /// 
    
    
    // Fee: $100 
    function createPool(string memory poolName, string memory metadataURI, address userAddress) public {
        require(userAddressTouserAccount[userAddress].userAccountStatus==true,'Create account first.');

        address newPool = address(new Pool(poolName, address(this))); // returns address of the new pool.

        // poolAddressToPoolDetail[newPool].poolAddress = poolAddress;
        poolAddressToStatus[newPool] = true;
        poolAddressToPoolDetail[newPool].poolContractAddress = newPool;
        userAddressTouserAccount[userAddress].userAssociatedPools.push(newPool);
        poolAddressToPoolDetail[newPool].members.push(userAddress);
        poolAddressToPoolDetail[newPool].currentMemberCount++;
        

        userToPoolMembership[userAddress][newPool]=true; // for membership

        Pool poolContract = Pool(newPool);
        poolContract.setUserMetadataURI(userAddress, metadataURI);

        poolCount.increment();
    }

    // Fee: $100

    function joinPool(address poolAddress, address userAddress, string memory metadataURI) public {
        require(userAddressTouserAccount[userAddress].userAccountStatus==true,'Create account first.');
        require(poolAddressToStatus[poolAddress] == true,'No pool found  with given poolAddress');

        uint256 empty = (2 - poolAddressToPoolDetail[poolAddress].members.length);

        require((empty > 1) || (empty == 1),'Not enough slot in the pool.');

        userToPoolMembership[userAddress][poolAddressToPoolDetail[poolAddress].poolContractAddress]=true; // for membership
        poolAddressToPoolDetail[poolAddress].currentMemberCount++;
        userAddressTouserAccount[userAddress].userAssociatedPools.push(poolAddress);
        poolAddressToPoolDetail[poolAddress].members.push(userAddress);

        Pool poolContract = Pool(poolAddress);
        poolContract.setUserMetadataURI(userAddress, metadataURI);
    }

    function testingConcept(address poolAddress, address _userAddress) public view returns(string memory) {
        Pool poolContract = Pool(poolAddressToPoolDetail[poolAddress].poolContractAddress);
        return poolContract.getUserMetadatURI(_userAddress);
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