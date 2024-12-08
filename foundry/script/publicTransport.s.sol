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
        publicTransportTracker = new PublicTransportTracker(1000000000000000000, 0xc8baf8eEAB6F63aC4B2F8605E70e9367d9803D5e, 0xc8baf8eEAB6F63aC4B2F8605E70e9367d9803D5e);
        vm.stopBroadcast();
    }
}
