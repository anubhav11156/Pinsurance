//SPDX-License-Identifier: MIT

pragma solidity 0.8.13;


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Policy is ERC721URIStorage {

    bool transferLocked; // yea | true

    constructor() ERC721("Policy NFT", "POL") {
        transferLocked = true;
    }

    struct policyNFT {
        uint256 tokenID;
        address owner;
    }

    mapping(uint256 => policyNFT) idToPolicy;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;


    /*--------------------------------------Mint Policy NFT-------------------------------------*/

    function createPolicyToken(string memory policyDataURI) public returns(uint256) {

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(_msgSender() , newItemId);
        _setTokenURI(newItemId, policyDataURI);

        createPolicyNFT(newItemId);

        return newItemId;

    }

    function createPolicyNFT(uint256 tokenId) internal {
        idToPolicy[tokenId].tokenID = tokenId;
        idToPolicy[tokenId].owner = msg.sender;
    }

    /*------------------------------------------------------------------------------------------*/


    // fetches user all Policy NFTs
    function fetchMyPolicies(address onwerAddress) public view returns(policyNFT[] memory) {
        uint256 totalNFTsCount = _tokenIds.current();
        uint256 nftCount = 0;
        uint256 currentIndex = 0;

        // first find total no. of nfts owned by the user
        for(uint i=0; i<totalNFTsCount; i++){
            if(idToPolicy[i+1].owner==onwerAddress){
                nftCount++;
            }
        }

        policyNFT[] memory myNFTs = new policyNFT[](nftCount);

        for(uint i=0; i<totalNFTsCount; i++){
            if(idToPolicy[i+1].owner==onwerAddress){
                uint currentId = i+1;
                policyNFT storage currentNFT = idToPolicy[currentId];
                myNFTs[currentIndex] = currentNFT;
                currentIndex++;
            }
        }
        return myNFTs;
    }

    // Lock transfer of Policy once it is minted.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require( (!_exists(tokenId) && transferLocked), "ERROR: Transfer of Policy is not allowed!");
    }

}