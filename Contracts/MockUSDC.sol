//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract FakeUSDC is ERC20("MockUSDc", "FUSDC"),Ownable{

    function mintFakeUSDC() public onlyOwner {
        _mint(msg.sender, 1000000 * 10**18);
    }
}