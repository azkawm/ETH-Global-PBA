// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaceToken.sol";

contract PublicTransportTracker {
    // Struct to represent a passenger's journey

    ICarbonToken token;

    struct Journey {
        string entryStation;
        string exitStation;
        uint256 reward;
        bool isCompleted;
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
    //string[] public stations;
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
        require(!journeys[passenger].isCompleted, "Complete your current journey first");
        _;
    }

    constructor(address tokenAddress, uint256 _rewardPerUnit /*string[] memory _stations*/) {
        owner = msg.sender;
        rewardPerUnit = _rewardPerUnit;
        //stations = _stations;
        token = ICarbonToken(tokenAddress);
    }

    // Admin functions
    function updaterewardPerUnit(uint256 newFare) external onlyOwner {
        rewardPerUnit = newFare;
    }

    function updaterewardCap(uint256 newCap) external onlyOwner {
        milezCap = newCap;
    }

    // function addStation(string memory station) external onlyOwner {
    //     stations.push(station);
    // }

    // Passenger functions
    function startJourney(string memory entryStation) external journeyNotStarted(msg.sender) {
        journeys[msg.sender] = Journey({
            entryStation: entryStation,
            exitStation: "",
            reward: 0,
            isCompleted: false
        });

        emit JourneyStarted(msg.sender, entryStation);
    }

    function completeJourney(string memory exitStation) external {
        Journey storage journey = journeys[msg.sender];
        require(!journey.isCompleted, "Journey already completed");

        journey.exitStation = exitStation;
        //journey.reward = calculateReward(distance);
        journey.isCompleted = true;
        if (keccak256(abi.encodePacked(exitStation)) == keccak256(abi.encodePacked("Station B")) 
        && keccak256(abi.encodePacked(journey.entryStation)) == keccak256(abi.encodePacked("Station A"))) {
    
        wallets[msg.sender].milez += stationB;
    
        } else if (keccak256(abi.encodePacked(exitStation)) == keccak256(abi.encodePacked("Station C")) 
           && keccak256(abi.encodePacked(journey.entryStation)) == keccak256(abi.encodePacked("Station A"))) {
    
        wallets[msg.sender].milez += stationC;

        }

        emit JourneyCompleted(msg.sender, exitStation, journey.reward);
    }

    function tokenRedeem() external {
        Journey storage journey = journeys[msg.sender];
        require(journey.isCompleted, "Journey not completed");
        require(wallets[msg.sender].milez >= milezCap, "Insufficient Milez");
        // Refund excess amount
        //uint256 _reward = calculateReward(distance);
        uint256 milez = wallets[msg.sender].milez;
        uint256 reward = wallets[msg.sender].milez/milezCap;
        wallets[msg.sender].milez -= milez;
        wallets[msg.sender].balance += calculateReward(reward);

        emit FarePaid(msg.sender, journey.reward);

        // Reset journey
        delete journeys[msg.sender];
    }

    function withdrawCarbonToken(uint256 _amount) external{
        require(wallets[msg.sender].balance >= _amount, "need more funds");
        wallets[msg.sender].balance -= _amount;
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

    // function getStations() external view returns (string[] memory) {
    //     return stations;
    // }
}