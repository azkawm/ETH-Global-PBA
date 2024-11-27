// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "carbonToken.sol";

interface IStandardToken {
    // Function to get the decimals of the token
    function decimals() external view returns (uint8);

    // Minting function to create new tokens
    function mint(address to, uint256 amount) external;

    // Burning function to destroy tokens from the owner's account
    function burn(uint256 amount) external;

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    // Pause token transfers
    function pause() external;

    // Unpause token transfers
    function unpause() external;
}
