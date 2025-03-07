//  SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    uint256 private _itemId;
    uint256 private _itemsSold;

    address payable owner;
    uint256 listingPrice = 0.025 ether;
    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItems {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItems) public idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // function updateListingPrice(uint _listingPrice) public payable {
    //     require(
    //         owner == msg.sender,
    //         "Only marketplace owner can update listing price."
    //     );
    //     listingPrice = _listingPrice;
    // }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _itemId++;
        uint256 itemId = _itemId;

        idToMarketItem[itemId] = MarketItems(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchse.!"
        );
        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold++;
        payable(owner).transfer(listingPrice);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItems[] memory) {
        uint256 itemCount = _itemId;
        uint256 unsoldItemCount = _itemId - _itemsSold;
        uint256 currentIndex = 0;

        MarketItems[] memory items = new MarketItems[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItems storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs(
        address userAddress
    ) public view returns (MarketItems[] memory) {
        uint totalItemCount = _itemId;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == userAddress) {
                itemCount += 1;
            }
        }
        MarketItems[] memory items = new MarketItems[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == userAddress) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItems storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsCreated(
        address userAddress
    ) public view returns (MarketItems[] memory) {
        uint256 totalItemCount = _itemId;
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == userAddress) {
                itemCount += 1;
            }
        }
        MarketItems[] memory items = new MarketItems[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == userAddress) {
                uint256 currentId = i + 1;
                MarketItems storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Get functions

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
}
