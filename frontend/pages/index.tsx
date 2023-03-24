import type { NextPage } from "next";
import Head from "next/head";
import * as ethers from "ethers";
import { Contract, Web3Provider } from "zksync-web3";
import casinoGameAbi from "../utils/casinoGameAbi.json";
import { useState } from "react";
import BigNumber from "bignumber.js";
import useGameInit from "../hooks/useGameInit";
import {
  CASINO_GAME_ADDRESS,
  WINNER_TOPIC_HASH,
  ZKS_SYNC_GOERLI_TESTNET,
} from "../constants";

const Home: NextPage = () => {
  const [numberGuessed, setNumberGuessed] = useState<number | undefined>(
    undefined
  );
  const { gameState, setGameState } = useGameInit();

  const guessNumber = async (number: number | undefined) => {
    const provider = new Web3Provider(window?.ethereum);

    const signer = provider.getSigner();
    const contract = new Contract(CASINO_GAME_ADDRESS, casinoGameAbi, signer);
    const options = { value: ethers.utils.parseEther("0.001") };
    const tx = await contract.guess(number, options);

    window.alert(
      `Transaction submitted! You can check status on https://goerli.explorer.zksync.io/tx/${tx.hash}`
    );

    const receipt = await tx.wait();
    let isWinner = false;
    receipt.logs?.forEach((log: any) => {
      if (log.topics[0] == WINNER_TOPIC_HASH) {
        console.log("winner :-)");
        isWinner = true;
      }
    });

    if (isWinner) {
      window.alert(
        `You won! Check your wallet tx hash https://goerli.explorer.zksync.io/tx/${tx.hash}`
      );
    } else {
      window.alert(
        `You lost! Try again! tx hash https://goerli.explorer.zksync.io/tx/${tx.hash}`
      );
    }

    const casinoBalance = await provider.getBalance(CASINO_GAME_ADDRESS);

    setGameState({
      ...gameState,
      casinoBalance: casinoBalance.toString(),
    });

    setNumberGuessed(undefined);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Casino Game</title>
      </Head>

      <div className="space-y-10 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-y-8 gap-x-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Casino Game
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              To Play, please follow the instructions below:
            </p>
            <ul>
              <li>1. Connect wallet to metamask & set to zkSync Era Testnet</li>
              <li>2. It costs 0.001 eth to play the game</li>
              <li>3. Guess a number between 1 and 10,000</li>
              <li>
                4. If you guess the number, you win 80% of what's in the
                contract <br></br> + some fun stuff
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <h3>
                    <b>
                      {ethers.utils.formatEther(gameState.casinoBalance || 0)}
                    </b>
                    ETH in casino
                  </h3>
                  <h3>
                    <b>
                      {ethers.utils.formatEther(
                        BigNumber(gameState.casinoBalance || 0)
                          .multipliedBy(0.8)
                          .toString()
                      )}
                    </b>
                    ETH you can win :-)
                  </h3>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Guess Number
                  </label>
                  <div className="mt-2">
                    <input
                      value={String(numberGuessed)}
                      onChange={(e) => {
                        setNumberGuessed(Number(e.target.value));
                      }}
                      type="number"
                      name="numberGuessed"
                      id="numberGuessed"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm p-2 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="guess a number :-)"
                    />
                  </div>
                </div>

                <div className="col-span-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 py-4 px-4 sm:px-8">
              <button
                disabled={
                  !gameState.isMetaMaskConnected ||
                  gameState.chainId !== ZKS_SYNC_GOERLI_TESTNET
                }
                onClick={(e) => {
                  guessNumber(numberGuessed);
                }}
                className="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {!gameState.isMetaMaskConnected
                  ? "Please Connect Metamask"
                  : gameState.chainId !== ZKS_SYNC_GOERLI_TESTNET
                  ? "Please Switch to ZKSync Goerli Testnet"
                  : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
