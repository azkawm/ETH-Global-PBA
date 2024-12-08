// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaceToken.sol";
import "./interfaceStorage.sol";

contract PublicTransportTracker {
    IStorage private storage_; // Storage reference
    IStandardToken token;

    constructor(uint256 _rewardPerUnit, address _storageAddress, address tokenAddress) {
        owner = msg.sender;
        rewardPerUnit = _rewardPerUnit;
        storage_ = IStorage(_storageAddress);
        token = IStandardToken(tokenAddress);
    }

    struct Journey {
        string entryStation;
        string exitStation;
        bool isCompleted;
        bool isOnWay;
    }

    struct Wallet {
        string name;
        uint256 balance;
        uint256 milez;
    }

    // Fare per distance unit
    uint256 public rewardPerUnit;

    // Address of the contract owner (admin)
    address public owner;
    uint256 public milezCap;

    // List of valid stations
    uint stationA = 0;
    uint stationB = 2;
    uint stationC = 4;

    // Mapping of passengers to their journey details
    mapping(address => Journey) public journeys;
    mapping(address => Wallet) public wallets;

    // Events
    event JourneyStarted(address indexed passenger, string entryStation);
    event JourneyCompleted(address indexed passenger, string exitStation, uint256 fare);
    event FarePaid(address indexed passenger, uint256 amount);
    event Deposit(address indexed sender, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier journeyNotStarted(address passenger) {
        require(!journeys[passenger].isOnWay, "Complete your current journey first");
        _;
    }

    // Admin functions
    function updaterewardPerUnit(uint256 newReward) external onlyOwner {
        rewardPerUnit = newReward;
    }

    function updaterewardCap(uint256 newCap) external onlyOwner {
        milezCap = newCap;
    }

    // Passenger functions
    function startJourney(string memory entryStation) external journeyNotStarted(msg.sender) {
        Journey storage journey = journeys[msg.sender];
        journey.entryStation = entryStation;
        journey.isOnWay = true;
        journey.isCompleted = false;

        emit JourneyStarted(msg.sender, entryStation);
    }

    function completeJourney(string memory exitStation) external {
        Journey storage journey = journeys[msg.sender];
        require(!journey.isCompleted, "Journey already completed");

        journey.exitStation = exitStation;
        journey.isCompleted = true;
        journey.isOnWay = false;
        if (keccak256(abi.encodePacked(exitStation)) == keccak256(abi.encodePacked("Station B")) 
        && keccak256(abi.encodePacked(journey.entryStation)) == keccak256(abi.encodePacked("Station A"))) {
    
        //wallets[msg.sender].milez += stationB;
        storage_.addMilez(msg.sender, stationB);
        storage_.addDistance(msg.sender, stationB);
        
    
        } else if (keccak256(abi.encodePacked(exitStation)) == keccak256(abi.encodePacked("Station C")) 
           && keccak256(abi.encodePacked(journey.entryStation)) == keccak256(abi.encodePacked("Station A"))) {
    
        //wallets[msg.sender].milez += stationC;
        storage_.addMilez(msg.sender, stationC);
        storage_.addDistance(msg.sender, stationC);

        }

        emit JourneyCompleted(msg.sender, exitStation, stationC);
    }

    function tokenRedeem() external {
        require(storage_.getMilez(msg.sender) >= milezCap, "Insufficient Milez");
        // Refund excess amount
        uint256 milez = storage_.getMilez(msg.sender);
        uint256 reward = milez/milezCap;
        storage_.deductMilez(msg.sender, milez);
        storage_.addBalance(msg.sender, calculateReward(reward));

        emit FarePaid(msg.sender, calculateReward(reward));

        // Reset journey
        delete journeys[msg.sender];
    }

    function withdrawCarbonToken(uint256 _amount) external{
        require(storage_.getBalance(msg.sender) >= _amount, "need more funds");
        storage_.deductBalance(msg.sender, _amount);
        token.transferFrom(owner, msg.sender, _amount);
    }

    // Helper functions
    function calculateReward(uint256 distance) public view returns (uint256) {
        return distance * rewardPerUnit;
    }

    function deposit() public payable {
        require(msg.value > 0, "Must send some Ether");

        // Emit the Deposit event
        emit Deposit(msg.sender, msg.value);
    }

    // Get the total balance of the contract
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function testDeductBalance(address user, uint amount) external {
        storage_.deductBalance(user, amount); 
        
        //require (storage_.getBalance(msg.sender) == 10); // Ensure that the balance of `msg.sender` is 10
    }

    function testGetBalance(address user) public view returns (uint){
        return storage_.getBalance(user);
    }
}