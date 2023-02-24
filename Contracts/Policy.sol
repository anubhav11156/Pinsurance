//SPDX-License-Identifier: MIT

pragma solidity 0.8.13;


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Policy is ERC721URIStorage {

    bool trnasferAllowed;

    constructor() ERC721("Policy NFT", "POL") {
        trnasferAllowed = false;
    }

    struct policyNFT {
        uint256 tokenID;
        address owner;
    }

    mapping(uint256 => policyNFT) idToPolicy;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;   // _tokenIds is how many no. of tokens are created

    function createPolicyToken(string memory policyDataURI) public returns(uint256) {

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(_msgSender() , newItemId);
        _setTokenURI(newItemId, policyDataURI);

        createPolicyNFT(newItemId);

        return newItemId;

    }

    function createPolicyNFT(uint256 tokenId) public {
        idToPolicy[tokenId].tokenID = tokenId;
        idToPolicy[tokenId].owner = msg.sender;
    }

    // function _beforeTokenTransfer() {

    // }

    // fetches user all Policy NFTs

    
}