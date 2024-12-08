// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaceToken.sol";
import "./interfaceTransportTracker.sol";

contract MarketPlace {
    
    ITestLogic private testLogic;
    IStandardToken token;

    address payable public owner;
    address payable public contractAddr;
    
    struct Item{
        uint id;
        string name;
        uint price;
        uint stocks;
        address payable seller;
        address payable owner;
        bool status;
    }

    mapping(uint=>Item) public itemLists;
    uint counter;

    event Listing(address, Item);
    event purchase(address, Item);
    event withdrawal(address, uint);

    receive() external payable { }

    constructor(address tokenAddress, address _testLogic){
        owner = payable(msg.sender);
        contractAddr = payable(address(this));
        token = IStandardToken(tokenAddress);
        testLogic = ITestLogic(address(_testLogic));
    }

    error InvalidAmount();
    error InvalidAddress();

    function listingItems(string memory n, uint p) external{
        counter++;
        itemLists[counter]=Item(counter, n, p, 0, payable(msg.sender), payable(address(0)),false);
    }

    function getItemReady(uint id, uint _stocks) external{
        itemLists[id].stocks += _stocks;
    }

    function purchaseItems(uint id) external payable{
        require(itemLists[id].stocks > 0, "item is not ready");
        if(testLogic.testGetBalance(msg.sender) >= (itemLists[id].price)){
            testLogic.testDeductBalance(msg.sender, (itemLists[id].price));
            itemLists[id].owner = payable(msg.sender);
            itemLists[id].status = true;
            itemLists[id].stocks--;
            emit purchase(msg.sender, itemLists[id]);
        }else{
            revert InvalidAmount();
        }
    }

    function purchaseItemsWithToken(uint id) external payable{
        require(itemLists[id].stocks > 0, "item is not ready");
            token.transferFrom(msg.sender, address(this), itemLists[id].price);
            itemLists[id].owner = payable(msg.sender);
            itemLists[id].status = true;
            itemLists[id].stocks--;
            emit purchase(msg.sender, itemLists[id]);
    }

    function withdrawFunds(uint id) external payable returns(bool){
        if(msg.sender == itemLists[id].seller){
             emit withdrawal(msg.sender, itemLists[id].price);
            return payable(msg.sender).send(itemLists[id].price);
        }else{
            revert InvalidAddress();
        }
    }
}