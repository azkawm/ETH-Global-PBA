// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Storage.sol";

contract StorageTest is Test {
    Storage storageContract;

    address owner = address(0x1);
    address user = address(0x2);
    address newVersion = address(0x3);

    function setUp() public {
        vm.startPrank(owner);
        storageContract = new Storage();
        vm.stopPrank();
    }

    function testOwnerCanUpgradeVersion() public {
        vm.startPrank(owner);
        storageContract.upgradeVersion(newVersion);
        assertEq(storageContract.latestVersion(), newVersion);
        vm.stopPrank();
    }

    function testNonOwnerCannotUpgradeVersion() public {
        vm.startPrank(user);
        vm.expectRevert("Only owner can call this function.");
        storageContract.upgradeVersion(newVersion);
        vm.stopPrank();
    }

    function testAddDistanceByLatestVersion() public {
        vm.startPrank(owner);
        storageContract.upgradeVersion(newVersion);
        vm.stopPrank();

        vm.startPrank(newVersion);
        storageContract.addDistance(user, 100);
        assertEq(storageContract.getDistance(user), 100);
        vm.stopPrank();
    }

    function testAddMilezByLatestVersion() public {
        vm.startPrank(owner);
        storageContract.upgradeVersion(newVersion);
        vm.stopPrank();

        vm.startPrank(newVersion);
        storageContract.addMilez(user, 50);
        assertEq(storageContract.getMilez(user), 50);
        vm.stopPrank();
    }

    function testDeductMilezByLatestVersion() public {
        vm.startPrank(owner);
        storageContract.upgradeVersion(newVersion);
        vm.stopPrank();

        vm.startPrank(newVersion);
        storageContract.addMilez(user, 50);
        storageContract.deductMilez(user, 30);
        assertEq(storageContract.getMilez(user), 20);
        vm.stopPrank();
    }

    function testAddBalance() public {
        vm.startPrank(user);
        storageContract.addBalance(user, 100);
        assertEq(storageContract.getBalance(user), 100);
        vm.stopPrank();
    }

    function testDeductBalance() public {
        vm.startPrank(user);
        storageContract.addBalance(user, 100);
        storageContract.deductBalance(user, 50);
        assertEq(storageContract.getBalance(user), 50);
        vm.stopPrank();
    }

    function testAddDistanceFailsWithoutLatestVersion() public {
        vm.startPrank(user);
        vm.expectRevert("Only latest version can call this function.");
        storageContract.addDistance(user, 100);
        vm.stopPrank();
    }

    function testAddMilezFailsWithoutLatestVersion() public {
        vm.startPrank(user);
        vm.expectRevert("Only latest version can call this function.");
        storageContract.addMilez(user, 50);
        vm.stopPrank();
    }
}
