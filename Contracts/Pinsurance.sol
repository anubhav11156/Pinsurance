//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./Pool.sol";

contract Pinsurance {

    using Counters for Counters.Counter;
    Counters.Counter public userCount;
    Counters.Counter public poolCount;

    address owner; // onwer of the platform will be Pinsrurance.

    constructor() {
        owner = msg.sender;
    }

    // address[] listOfUsers; // total number of users on pinsurance
    // address[] listOfPools; // total number of pools on pinsurance

    bytes16 private constant _SYMBOLS = "0123456789abcdef"; // for converting address to string

    // User account data
    struct userAccount {
        string userName;
        string userImageCID;
        address userAddress;
        uint256 userAge;
        string userEmailID;
        bool userAccountStatus; // true => user Exist, false => user doesn't exist
        address[] userAssociatedPools; // list of insurance pool user is associated with
    }

    // user account detail mapping
    mapping(address => userAccount) userAddressTouserAccount;

    // Pool data  ---> set pool member limit to 2 for demo purpose
    struct poolDetail {
        string poolID;
        address poolContractAddress;        
        bool active;
        uint256 currentMemberCount;
        address[] members;
        mapping(address => bool) isMember;
    }

    // naonid to pooldetail mapping | nanoid will be a string.
    mapping(string => poolDetail) poolIdToPoolDetail;

    // function to create user account | creation of user will be free and platform will pay the gas fees.
    function createUser(
        string memory _name,
        string memory _profileCid,
        uint256 _age,
        string memory _userEmail
    ) public {
        // creates a pointer to userAccount type
        userAccount storage currentUser = userAddressTouserAccount[msg.sender];
        currentUser.userName = _name;
        currentUser.userImageCID = _profileCid;
        currentUser.userAddress = msg.sender;  
        currentUser.userAge = _age;
        currentUser.userEmailID = _userEmail;
        currentUser.userAccountStatus = true;
        userCount.increment();
    }

    function getUserAccountStatus() public view returns(bool){
        // creates a pointer 
        return userAddressTouserAccount[msg.sender].userAccountStatus;
    }

    // function to get user account detail 
    function getUserDetail() public view returns(userAccount memory) {
        return userAddressTouserAccount[msg.sender];
    }



    // function to create pool
    function createPool(string memory poolId) public {
        require(userAddressTouserAccount[msg.sender].userAccountStatus==true,'Create account first.');

        address newPool = address(new Pool()); // returns address of the new pool.
        poolIdToPoolDetail[poolId].poolID = poolId;
        poolIdToPoolDetail[poolId].active = true;
        poolIdToPoolDetail[poolId].poolContractAddress = newPool;
        userAddressTouserAccount[msg.sender].userAssociatedPools.push(newPool);
        poolIdToPoolDetail[poolId].members.push(msg.sender);
        poolIdToPoolDetail[poolId].currentMemberCount++;
        poolIdToPoolDetail[poolId].isMember[msg.sender] = true;
        poolCount.increment();
    }

    // function to join pool
    function joinPool(string memory poolId) public {
        require(userAddressTouserAccount[msg.sender].userAccountStatus==true,'Create account first.');
        require(poolIdToPoolDetail[poolId].active==true,'No pool found  with given poolID');

        uint256 empty = (2 - poolIdToPoolDetail[poolId].members.length);

        require((empty > 1) || (empty == 1),'Not enough slot in the pool.');

        poolIdToPoolDetail[poolId].isMember[msg.sender] = true;
        poolIdToPoolDetail[poolId].currentMemberCount++;
        userAddressTouserAccount[msg.sender].userAssociatedPools.push(poolIdToPoolDetail[poolId].poolContractAddress);
        poolIdToPoolDetail[poolId].members.push(msg.sender);
    }

    function getPoolContractAddress(string memory poolId) public view returns(address) {
        // check if pool exists
        require(poolIdToPoolDetail[poolId].active == true,'No pool found with given poolId.');
        return poolIdToPoolDetail[poolId].poolContractAddress;
    }

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

    // function getUserAllPools() public  {

    // }

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