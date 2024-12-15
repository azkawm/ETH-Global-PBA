// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Marketplace.sol";
import "../src/InterfaceToken.sol";
import "../src/InterfaceTransportTracker.sol";

contract MarketplaceTest is Test {
    Marketplace marketplace;
    MockToken token;
    MockTransportToken transportToken;

    address owner = address(0x1);
    address seller = address(0x2);
    address buyer = address(0x3);

    function setUp() public {
        vm.startPrank(owner);

        token = new MockToken();
        transportToken = new MockTransportToken();

        // Deploy the Marketplace contract
        marketplace = new Marketplace(address(token), address(transportToken));

        // Fund buyer with tokens
        token.mint(buyer, 1000 ether);
        transportToken.testSetBalance(buyer, 50 ether);

        vm.stopPrank();
    }

    function testListingItems() public {
        vm.startPrank(owner);
        marketplace.listingItems("Test Item", 5 ether);
        vm.stopPrank();

        (uint id, string memory name, uint price, uint stocks, address payable _seller, , bool status) = marketplace.itemLists(1);

        assertEq(id, 1);
        assertEq(name, "Test Item");
        assertEq(price, 5 ether);
        assertEq(stocks, 0);
        assertEq(_seller, owner);
        assertEq(status, false);
    }

    function testGetItemReady() public {
        vm.startPrank(owner);
        marketplace.listingItems("Test Item", 5 ether);
        marketplace.getItemReady(1, 10);
        vm.stopPrank();

        (, , , uint stocks, , , ) = marketplace.itemLists(1);
        assertEq(stocks, 10);
    }

    function testPurchaseItems() public {
        vm.startPrank(owner);
        marketplace.listingItems("Test Item", 5 ether);
        marketplace.getItemReady(1, 10);
        vm.stopPrank();

        vm.startPrank(buyer);
        marketplace.purchaseItems(1);
        vm.stopPrank();

        (, , , uint stocks, , address payable _owner, bool status) = marketplace.itemLists(1);
        assertEq(stocks, 9);
        assertEq(_owner, buyer);
        assertEq(status, true);
    }

    function testPurchaseItemsWithToken() public {
        vm.startPrank(owner);
        marketplace.listingItems("Test Item", 5 ether);
        marketplace.getItemReady(1, 10);
        vm.stopPrank();

        vm.startPrank(buyer);
        token.approve(address(marketplace), 5 ether);
        marketplace.purchaseItemsWithToken(1);
        vm.stopPrank();

        (, , , uint stocks, , address payable _owner, bool status) = marketplace.itemLists(1);
        assertEq(stocks, 9);
        assertEq(_owner, buyer);
        assertEq(status, true);
    }

    function testWithdrawFunds() public {
        vm.startPrank(owner);
        marketplace.listingItems("Test Item", 5 ether);
        marketplace.getItemReady(1, 10);
        vm.stopPrank();

        vm.startPrank(buyer);
        token.approve(address(marketplace), 5 ether);
        marketplace.purchaseItemsWithToken(1);
        vm.stopPrank();

        vm.startPrank(owner);
        bool success = marketplace.withdrawFunds(1);
        assertTrue(success);
        vm.stopPrank();
    }
}

// Mock implementations for testing
contract MockToken is IStandardToken {
    mapping(address => uint) public balances;
    mapping(address => mapping(address => uint)) public allowances;

    function transferFrom(address from, address to, uint value) external override returns (bool) {
        require(balances[from] >= value, "Insufficient balance");
        require(allowances[from][msg.sender] >= value, "Allowance exceeded");
        balances[from] -= value;
        balances[to] += value;
        return true;
    }

    function mint(address to, uint value) public {
        balances[to] += value;
    }

    function approve(address spender, uint value) public returns (bool) {
        allowances[msg.sender][spender] = value;
        return true;
    }
}

contract MockTransportToken is IPublicTransportTracker {
    mapping(address => uint) public balances;

    function testSetBalance(address user, uint amount) public {
        balances[user] = amount;
    }

    function testGetBalance(address user) external view override returns (uint) {
        return balances[user];
    }

    function testDeductBalance(address user, uint amount) external override {
        require(balances[user] >= amount, "Insufficient balance");
        balances[user] -= amount;
    }
}
