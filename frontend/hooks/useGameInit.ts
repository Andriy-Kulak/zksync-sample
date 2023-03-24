import { useEffect, useState } from "react";
import { Contract, Web3Provider, Provider, Wallet } from "zksync-web3";
import { CASINO_GAME_ADDRESS } from "../constants";
import casinoGameAbi from "../utils/casinoGameAbi.json";

const useGameInit = () => {
  const [gameState, setGameState] = useState<{
    isMetaMaskConnected: boolean;
    chainId: number | undefined;
    casinoBalance: string;
  }>({
    isMetaMaskConnected: false,
    casinoBalance: "",
    chainId: undefined,
  });
  useEffect(() => {
    (async () => {
      // Client-side-only code
      if (window?.ethereum) {
        const provider = new Web3Provider(window?.ethereum);

        const casinoBalance = await provider.getBalance(CASINO_GAME_ADDRESS);
        const isMetaMaskConnected = async () => {
          const accounts = await provider.listAccounts();
          return accounts.length > 0;
        };
        console.log("is metamask connected", {
          isMetaMaskConnected: await isMetaMaskConnected(),
          casinoBalance: casinoBalance.toString(),
        });

        const network = await provider.getNetwork();

        setGameState({
          isMetaMaskConnected: await isMetaMaskConnected(),
          chainId: network.chainId,
          casinoBalance: casinoBalance.toString(),
        });

        window?.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        window?.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
      }
    })();
  }, []);

  return { gameState, setGameState };
};

export default useGameInit;
