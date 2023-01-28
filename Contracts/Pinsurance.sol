//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./Pool.sol";

contract Pinsurance {

    using Counters for Counters.Counter;
    Counters.Counter public userCount;
    Counters.Counter public poolCount;

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

    // user account detail mapping | Note: using string instead of address for simplicity, will optimize the code later on
    mapping(address => userAccount) userAddressTouserAccount;

    // Pool data
    struct poolDetail {
        address poolContractAddress;        
        bool active;
        uint256 limit;
        uint256 currentMemberCount;
        address[] members;
        mapping(address => bool) isMember;
    }

    // naonid to pooldetail mapping | nanoid will be a string.
    mapping(string => poolDetail) poolIdToPoolDetail;

    // function to create user account
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

        poolIdToPoolDetail[poolId].active = true;
        userAddressTouserAccount[msg.sender].userAssociatedPools.push(newPool);
        poolIdToPoolDetail[poolId].members.push(msg.sender);
        poolIdToPoolDetail[poolId].isMember[msg.sender] = true;
        poolCount.increment();
    }

    // function to join pool
    function joinPool(string memory poolId) public {
        require(userAddressTouserAccount[msg.sender].userAccountStatus==true,'Create account first.');
        require(poolIdToPoolDetail[poolId].active==true,'No pool find  with given poolID');

        poolIdToPoolDetail[poolId].isMember[msg.sender] = true;
        userAddressTouserAccount[msg.sender].userAssociatedPools.push(poolIdToPoolDetail[poolId].poolContractAddress);
        poolIdToPoolDetail[poolId].members.push(msg.sender);
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