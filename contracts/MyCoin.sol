//SPDX-License-Identifier: Unlicense

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error Unauthorized();

/// @dev this is for testing only
contract MyCoin is ERC20 {
    address public ownerAddress;

    /// @dev by default, there are 18 decimal
    constructor() ERC20("My Coin", "MC") {
        ownerAddress = msg.sender;
    }

    /// @dev method to give dummy ERC20 tokens to specific test addresses so we can test functionality
    function mintToAccount(address _to, uint256 amount) external {
        if (msg.sender != ownerAddress) {
            revert Unauthorized();
        }
        _mint(_to, amount);
    }
}
