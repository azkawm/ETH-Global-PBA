// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract StandardToken is ERC20, Ownable(address(msg.sender)), Pausable() {
    uint8 private _decimals;

    // Constructor that initializes the token's details and mints an initial supply to the owner
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply
    ) ERC20(name_, symbol_) {
        _decimals = decimals_;
        _mint(msg.sender, initialSupply * 10 ** uint256(_decimals));
    }

    // Override decimals function to return the specified decimal value
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    // Minting function that allows only the owner to create new tokens
    function mint(address to, uint256 amount) external onlyOwner whenNotPaused {
        _mint(to, amount * 10 ** uint256(_decimals));
    }

    // Burning function that allows only the owner to destroy tokens from any account
    function burn(uint256 amount) external onlyOwner whenNotPaused {
        _burn(msg.sender, amount * 10 ** uint256(_decimals));
    }

    // Pauses all token transfers; only the owner can trigger this
    function pause() external onlyOwner {
        _pause();
    }

    // Unpauses all token transfers; only the owner can trigger this
    function unpause() external onlyOwner {
        _unpause();
    }

    // Override ERC20 transfer function to include pause functionality
    // function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
    //     super._beforeTokenTransfer(from, to, amount);
    //     require(!paused(), "ERC20: token transfer while paused");
    // }

    function _beforeTokenTransfer() internal virtual {
    require(!paused(), "ERC20: token transfer while paused");
}

}
