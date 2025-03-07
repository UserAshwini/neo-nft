//  SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 private _tokenIds;
    address contractAddress;

    constructor(address marketPlaceAddress) ERC721("Metaverse Tokens", "METT") {
        contractAddress = marketPlaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newTokenId;
    }
}
