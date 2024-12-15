// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {PublicTransportTracker} from "../src/PublicTransport.sol";

contract PublicTransportTrackerScript is Script {
    PublicTransportTracker public publicTransportTracker;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("optimism_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        publicTransportTracker = new PublicTransportTracker(1000000000000000000, 0xd64302f0D3C880d75913f3a9C3324e663Bc4d09d, 0xdfD6d4Bd4C28244F6BaBA7C9c310E204611B399f);
        vm.stopBroadcast();
    }
}
