// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/PublicTransportTracker.sol";
import "../src/InterfaceToken.sol";
import "../src/InterfaceStorage.sol";

contract PublicTransportTrackerTest is Test {
    PublicTransportTracker tracker;
    MockStorage mockStorage;
    MockToken mockToken;

    address owner = address(0x1);
    address user = address(0x2);

    uint256 rewardPerUnit = 10;
    uint256 milezCap = 100;

    function setUp() public {
        vm.startPrank(owner);

        mockStorage = new MockStorage();
        mockToken = new MockToken();

        tracker = new PublicTransportTracker(rewardPerUnit, address(mockStorage), address(mockToken));
        tracker.updaterewardCap(milezCap);

        mockStorage.setMilezCap(user, 0);
        mockToken.mint(owner, 1000 ether);

        vm.stopPrank();
    }

    function testStartJourney() public {
        vm.startPrank(user);
        tracker.startJourney("Station A");
        (string memory entryStation, , bool isCompleted, bool isOnWay) = tracker.journeys(user);
        
        assertEq(entryStation, "Station A");
        assertTrue(isOnWay);
        assertFalse(isCompleted);
        vm.stopPrank();
    }

    function testCompleteJourney() public {
        vm.startPrank(user);
        tracker.startJourney("Station A");
        tracker.completeJourney("Station B");

        (, string memory exitStation, bool isCompleted, bool isOnWay) = tracker.journeys(user);
        assertEq(exitStation, "Station B");
        assertTrue(isCompleted);
        assertFalse(isOnWay);
        assertEq(mockStorage.getMilez(user), 2);

        vm.stopPrank();
    }

    function testTokenRedeem() public {
        vm.startPrank(user);
        mockStorage.setMilez(user, milezCap);

        tracker.tokenRedeem();

        assertEq(mockStorage.getMilez(user), 0);
        assertEq(mockStorage.getBalance(user), rewardPerUnit * (milezCap / rewardPerUnit));
        vm.stopPrank();
    }

    function testWithdrawCarbonToken() public {
        vm.startPrank(user);
        mockStorage.addBalance(user, 50);

        vm.expectRevert("need more funds");
        tracker.withdrawCarbonToken(60);

        tracker.withdrawCarbonToken(50);

        assertEq(mockStorage.getBalance(user), 0);
        vm.stopPrank();
    }

    function testAdminFunctions() public {
        vm.startPrank(owner);

        tracker.updaterewardPerUnit(20);
        assertEq(tracker.rewardPerUnit(), 20);

        tracker.updaterewardCap(200);
        assertEq(tracker.milezCap(), 200);

        vm.stopPrank();
    }
}

// Mock implementations for testing
contract MockStorage is IStorage {
    mapping(address => uint256) private balances;
    mapping(address => uint256) private milez;

    function setMilez(address user, uint256 amount) public {
        milez[user] = amount;
    }

    function addMilez(address user, uint256 amount) external override {
        milez[user] += amount;
    }

    function deductMilez(address user, uint256 amount) external override {
        require(milez[user] >= amount, "Not enough Milez");
        milez[user] -= amount;
    }

    function getMilez(address user) external view override returns (uint256) {
        return milez[user];
    }

    function addBalance(address user, uint256 amount) external override {
        balances[user] += amount;
    }

    function deductBalance(address user, uint256 amount) external override {
        require(balances[user] >= amount, "Not enough balance");
        balances[user] -= amount;
    }

    function getBalance(address user) external view override returns (uint256) {
        return balances[user];
    }
}

contract MockToken is IStandardToken {
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        require(balances[from] >= amount, "Insufficient balance");
        require(allowances[from][msg.sender] >= amount, "Allowance exceeded");
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }

    function mint(address to, uint256 amount) public {
        balances[to] += amount;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowances[msg.sender][spender] = amount;
        return true;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
