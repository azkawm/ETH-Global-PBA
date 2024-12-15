// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/CarbonToken.sol";

contract CarbonTokenTest is Test {
    CarbonToken public carbonToken;

    address owner = address(0x1);
    address user = address(0x2);
    uint8 decimals = 18;
    uint256 initialSupply = 1000;

    function setUp() public {
        vm.startPrank(owner);
        carbonToken = new CarbonToken("Carbon Token", "CTK", decimals, initialSupply);
        vm.stopPrank();
    }

    function testInitialSupply() public {
        uint256 expectedSupply = initialSupply * 10 ** uint256(decimals);
        assertEq(carbonToken.totalSupply(), expectedSupply);
        assertEq(carbonToken.balanceOf(owner), expectedSupply);
    }

    function testMint() public {
        vm.startPrank(owner);
        uint256 mintAmount = 500;
        carbonToken.mint(user, mintAmount);

        uint256 expectedMinted = mintAmount * 10 ** uint256(decimals);
        assertEq(carbonToken.balanceOf(user), expectedMinted);
        assertEq(carbonToken.totalSupply(), (initialSupply + mintAmount) * 10 ** uint256(decimals));
        vm.stopPrank();
    }

    function testBurn() public {
        vm.startPrank(owner);
        uint256 burnAmount = 200;
        carbonToken.burn(burnAmount);

        uint256 expectedBurned = burnAmount * 10 ** uint256(decimals);
        uint256 remainingSupply = (initialSupply * 10 ** uint256(decimals)) - expectedBurned;
        assertEq(carbonToken.totalSupply(), remainingSupply);
        assertEq(carbonToken.balanceOf(owner), remainingSupply);
        vm.stopPrank();
    }

    function testPauseAndUnpause() public {
        vm.startPrank(owner);

        carbonToken.pause();
        assertTrue(carbonToken.paused());

        vm.expectRevert("ERC20: token transfer while paused");
        carbonToken.transfer(user, 10);

        carbonToken.unpause();
        assertFalse(carbonToken.paused());
        carbonToken.transfer(user, 10);
        assertEq(carbonToken.balanceOf(user), 10);

        vm.stopPrank();
    }

    function testNonOwnerCannotMintOrBurn() public {
        vm.startPrank(user);
        uint256 mintAmount = 500;
        vm.expectRevert("Ownable: caller is not the owner");
        carbonToken.mint(user, mintAmount);

        uint256 burnAmount = 200;
        vm.expectRevert("Ownable: caller is not the owner");
        carbonToken.burn(burnAmount);
        vm.stopPrank();
    }

    function testTransfer() public {
        vm.startPrank(owner);
        carbonToken.transfer(user, 100 * 10 ** uint256(decimals));
        assertEq(carbonToken.balanceOf(user), 100 * 10 ** uint256(decimals));
        vm.stopPrank();
    }
}
