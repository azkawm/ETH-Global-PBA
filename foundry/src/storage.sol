// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Storage {
    mapping(address => uint) balance;
    mapping(address => uint) distance;
    mapping(address => uint) milez;

    address public latestVersion;
    address public owner;

     modifier onlyLatestVersion() {
        require(msg.sender == latestVersion, "Only latest version can call this function.");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    constructor(){
        owner = msg.sender;
    }

     function upgradeVersion(address _newVersion) public onlyOwner {
        latestVersion = _newVersion;
    }

     function addDistance(address _receiver, uint _amount) public onlyLatestVersion{
        require(_amount > 0, "Amount should be greater than 0"); // Ensure that amount is positive
        distance[_receiver] += _amount;                            // Increase the balance of `_receiver` by `_amount`
    }

    function getDistance(address _receiver) external view returns (uint){
        return distance[_receiver];
    }

     function addMilez(address _receiver, uint _amount) public onlyLatestVersion {
        require(_amount > 0, "Amount should be greater than 0"); // Ensure that amount is positive
        milez[_receiver] += _amount;                            // Increase the balance of `_receiver` by `_amount`
    }
    
    function deductMilez(address _receiver, uint _amount) public onlyLatestVersion{
        require(_amount > 0, "Amount should be greater than 0"); // Ensure that amount is positive
        milez[_receiver] -= _amount;
    }

    function getMilez(address _receiver) external view returns (uint){
        return milez[_receiver];
    }

    function addBalance(address _receiver, uint _amount) public {
        require(_amount > 0, "Amount should be greater than 0"); // Ensure that amount is positive
        balance[_receiver] += _amount;                            // Increase the balance of `_receiver` by `_amount`
    }

    function deductBalance(address _receiver, uint _amount) public {
        require(_amount > 0, "Amount should be greater than 0"); // Ensure that amount is positive
        balance[_receiver] -= _amount;
    }

    function getBalance(address _receiver) external view returns (uint){
        return balance[_receiver];
    }
}