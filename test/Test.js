const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    // await market.deployed()
    const marketAddress = market.target
    console.log("Market Contract Address:", marketAddress); 


    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    // await nft.deployed()
    const nftContractAddress = nft.target
    console.log("NFT Contract Address:", nftContractAddress);
    
    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.parseUnits('100', 'ether');

    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")


    /* create two tokens */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice});
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice});

    const [_, buyerAddress] = await ethers.getSigners()

    /* execute sale of token to another user */
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice})
    console.log("Using NFT Contract Address:", nftContractAddress);

    let items = await market.fetchMarketItems()
    let myListedItems = await market.fetchItemsCreated();
    console.log("MylistedItems");
    console.log(myListedItems);
return
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId:i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
      }
      return item
    })) 
    console.log('items : ', items)      
    
  })
});
