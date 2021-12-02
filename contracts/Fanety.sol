// SPDX-License-Identifier: MIT
pragma solidity 0.5.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract Fanety is ERC20, ERC20Detailed {
    constructor(
        uint256 initialSupply
    ) public ERC20Detailed("Fanety", "FANETY", 18) {
        _mint(msg.sender, initialSupply);
    }
}
