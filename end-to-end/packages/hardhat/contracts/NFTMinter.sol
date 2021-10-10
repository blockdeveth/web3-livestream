//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMinter is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => address) idToCreatorAddress;
    mapping(address => uint256) priceNftByCreator;
    mapping(address => mapping(address => bool)) creatorToUser;
    mapping(address => bool) isCreator;

    constructor(string memory tokenName, string memory symbol) ERC721(tokenName, symbol) {
        _setBaseURI("ipfs://");
    }

    function price(address creator) external view returns (uint256) {
        require(isCreator[creator]==true, "not a creator");
        return priceNftByCreator[creator];
    }

    function addCreator(uint256 price) external {
        priceNftByCreator[msg.sender] = price;
        isCreator[msg.sender] = true;
    }

    function mintToken(address creator) external payable returns (uint256) {
        require(isCreator[creator] && msg.value >= priceNftByCreator[creator], "Price is higher than sent.");
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _safeMint(msg.sender, id);
        payable(creator).transfer(msg.value);
        creatorToUser[creator][msg.sender] = true;
        console.log("mint executed");
        return id;
    }

    function isNftOwner(address creator) external returns (bool) {
        return creatorToUser[creator][msg.sender];
    }
}
