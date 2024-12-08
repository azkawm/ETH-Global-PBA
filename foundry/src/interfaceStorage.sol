// SPDX-License-Identifier: MIT

import "./storage.sol";

pragma solidity ^0.8.0;

interface IStorage {
    function addBalance(address _receiver, uint256 _amount) external;
    function deductBalance(address _receiver, uint _amount) external;
    function getBalance(address _receiver) external view returns (uint);
    function addDistance(address _receiver, uint256 _amount) external;
    function getDistance(address _receiver) external view returns (uint);
    function addMilez(address _receiver, uint256 _amount) external;
    function deductMilez(address _receiver, uint256 _amount) external;
    function getMilez(address _receiver) external view returns (uint);
}