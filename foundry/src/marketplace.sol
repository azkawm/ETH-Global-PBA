// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./InterfaceToken.sol";
import "./InterfaceTransportTracker.sol";

contract Marketplace {
    
    IPublicTransportTracker private transportToken;
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

    constructor(address tokenAddress, address _transportToken){
        owner = payable(msg.sender);
        contractAddr = payable(address(this));
        token = IStandardToken(tokenAddress);
        transportToken = IPublicTransportTracker(address(_transportToken));
    }

    error InvalidAmount();
    error InvalidAddress();

    function listingItems(string memory n, uint p) external onlyOwner{
        counter++;
        itemLists[counter]=Item(counter, n, p, 0, payable(msg.sender), payable(address(0)),false);
        emit Listing(msg.sender,itemLists[counter]);
    }

    function getItemReady(uint id, uint _stocks) external{
        itemLists[id].stocks += _stocks;
    }

    function purchaseItems(uint id) external payable{
        require(itemLists[id].stocks > 0, "item is not ready");
        if(transportToken.testGetBalance(msg.sender) >= (itemLists[id].price)){
            transportToken.testDeductBalance(msg.sender, (itemLists[id].price));
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
    
    modifier onlyOwner() {
        require(msg.sender==owner,"Invalid Credential");
        _;
    }
}