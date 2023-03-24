import { useEffect, useState } from "react";
import { Web3Provider, Wallet, Provider } from "zksync-web3";
import { CASINO_GAME_ADDRESS } from "../constants";

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
        const provider = new Web3Provider(window?.ethereum) as any;

        const casinoBalance = await provider.getBalance(CASINO_GAME_ADDRESS);
        const isMetaMaskConnected = async () => {
          // web 3 provider doesn't recognize metamask's listAccounts so we have to cast it to any
          const accounts = await provider.listAccounts();
          return accounts.length > 0;
        };

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
