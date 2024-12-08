// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Marketplace} from "../src/marketplace.sol";

contract MrketplaceScript is Script {
    Marketplace public marketplace;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("ethereum_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        marketplace = new Marketplace(0xc8baf8eEAB6F63aC4B2F8605E70e9367d9803D5e, 0xc8baf8eEAB6F63aC4B2F8605E70e9367d9803D5e);
        vm.stopBroadcast();
    }
}
