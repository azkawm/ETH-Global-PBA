// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CarbonToken} from "../src/carbonToken.sol";

contract CarbonTokenScript is Script {
    CarbonToken public carbonToken;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("optimism_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        carbonToken = new CarbonToken("Milez Token", "MILEZ", 18, 100000000);
        vm.stopBroadcast();
    }
}
