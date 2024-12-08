// SPDX-License-Identifier: MIT
import "./PublicTransport.sol";

pragma solidity ^0.8.0;

interface IPublicTransportTracker{
    function testAddBalance() external;
    function testGetBalance(address user) external view returns (uint);
    function testDeductBalance(address user,uint amount) external;
}