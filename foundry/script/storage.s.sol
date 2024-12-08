// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Storage} from "../src/storage.sol";

contract StorageScript is Script {
    Storage public storage_;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("optimism_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        storage_ = new Storage();
        vm.stopBroadcast();
    }
}