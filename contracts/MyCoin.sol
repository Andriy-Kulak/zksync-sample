//SPDX-License-Identifier: Unlicense

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity 0.8.17;

error Unauthorized();

/// @dev this is for testing only
contract MyCoin is ERC20, Ownable {
    address public ownerAddress;

    /// @dev by default, there are 18 decimal
    constructor() ERC20("My Coin", "MC") {
        /// @dev minting 100k MC tokens to owner
        _mint(msg.sender, 100_000_000_000_000_000_000_000);
    }

    /// @dev method to give dummy ERC20 tokens to specific address that owner wants
    function mintToAccount(address _to, uint256 amount) external {
        if (msg.sender != owner()) {
            revert Unauthorized();
        }
        _mint(_to, amount);
    }
}
