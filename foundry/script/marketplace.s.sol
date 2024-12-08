// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Marketplace} from "../src/marketplace.sol";

contract MarketplaceScript is Script {
    Marketplace public marketplace;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("optimism_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        marketplace = new Marketplace(0xdfD6d4Bd4C28244F6BaBA7C9c310E204611B399f, 0x38aC81461F2b67334116EBf873B4aE59C2A3d463);
        vm.stopBroadcast();
    }
}
