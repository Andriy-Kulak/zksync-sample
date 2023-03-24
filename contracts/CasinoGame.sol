//SPDX-License-Identifier: Unlicense

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error IncorrectPayment();
error TransferFailed(uint8 reason);

contract CasinoGame is Ownable {
    uint256 public constant GUESS_PRICE = 0.001 ether;
    uint256 public constant WINNER_SHARE = 80;
    uint256 public constant ERC20_REWARD = 100;

    /// @dev this game is for informational purposes only. Don't ever store secret data in blockchain
    /// Here is reference on how someoone can read a secret number if they really wanted to: https://medium.com/solidified/keeping-secrets-on-ethereum-5b556c3bb1ee
    uint256 private secretNumber;
    address public erc20Token;

    event Winner(address indexed player, uint256 reward);
    event Loser(address indexed player);

    constructor(address _erc20Token, uint256 _secretNumber) {
        erc20Token = _erc20Token;
        secretNumber = _secretNumber;
    }

    function guess(uint256 _number) external payable {
        if (msg.value != GUESS_PRICE) {
            revert IncorrectPayment();
        }

        if (_number == secretNumber) {
            /// @dev this is a simple way to calculate the reward. In real world, you may want to track reward balance in a local variable since people can send ETH to this contract bypassing the guess() function
            uint256 ethReward = (address(this).balance * WINNER_SHARE) / 100;
            uint256 erc20Reward = (ERC20_REWARD) * (10 ^ 18);

            (bool ethSuccess, ) = address(msg.sender).call{value: ethReward}(
                ""
            );
            if (!ethSuccess) {
                revert TransferFailed(1);
            }

            bool erc20Success = IERC20(erc20Token).transfer(
                msg.sender,
                erc20Reward
            );
            if (!erc20Success) {
                revert TransferFailed(2);
            }

            emit Winner(msg.sender, ethReward);
        } else {
            emit Loser(msg.sender);
        }
    }

    function setSecretNumber(uint256 _newSecretNumber) external onlyOwner {
        secretNumber = _newSecretNumber;
    }
}
