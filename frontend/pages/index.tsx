import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import * as ethers from "ethers";
import { Contract, Web3Provider, Provider, Wallet } from "zksync-web3";
import casinoGameAbi from "../utils/casinoGameAbi.json";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const erc20address = "";
  const casinGameAddress = "0xAcDc11Df900624F20A7Fbe85c58cf867C08c279e";
  const [gameState, setGameState] = useState({
    isMetaMaskConnected: false,
    casinoBalance: "",
  });

  // Currently, only one environment is supported.
  //  const provider = new Provider("https://zksync2-testnet.zksync.dev");
  // Note that we still need to get the Metamask signer

  useEffect(() => {
    (async () => {
      // Client-side-only code
      if (window?.ethereum) {
        const provider = new Web3Provider(window?.ethereum);
        const signer = provider.getSigner();
        const contract = new Contract(casinGameAddress, casinoGameAbi, signer);
        console.log("contract ", contract);
        const casinoBalance = await provider.getBalance(casinGameAddress);
        const isMetaMaskConnected = async () => {
          const accounts = await provider.listAccounts();
          return accounts.length > 0;
        };
        console.log("is metamask connected", {
          isMetaMaskConnected: await isMetaMaskConnected(),
          casinoBalance: casinoBalance.toString(),
        });

        setGameState({
          isMetaMaskConnected: await isMetaMaskConnected(),
          casinoBalance: casinoBalance.toString(),
        });

        const token = await contract.erc20Token();
        console.log("token ", token);
      }
    })();
  }, []);

  const guessNumber = async (number: number) => {
    if (window?.ethereum) {
      const provider = new Web3Provider(window?.ethereum);
      const signer = provider.getSigner();
      const contract = new Contract(casinGameAddress, casinoGameAbi, signer);
      const options = { value: ethers.utils.parseEther("0.001") };
      const tx = await contract.guess(number, options);
      console.log("tx ", tx);
      tx.wait().then((receipt) => {
        console.log("receipt ", receipt);
      });
    }
  };

  // const zkSyncProvider = new Provider("https://zksync2-testnet.zksync.dev");
  // const ethProvider = ethers.getDefaultProvider("goerli");
  // const zkSyncWallet = new Wallet(
  //   process.env.PRIVATE_KEY as string,
  //   zkSyncProvider,
  //   ethProvider
  // );
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing{" "}
          <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">
            pages/index.tsx
          </code>
        </p>

        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <a
            href="https://nextjs.org/docs"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
            <p className="mt-4 text-xl">
              Find in-depth information about Next.js features and its API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Learn &rarr;</h3>
            <p className="mt-4 text-xl">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Examples &rarr;</h3>
            <p className="mt-4 text-xl">
              Discover and deploy boilerplate example Next.js projects.
            </p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Deploy &rarr;</h3>
            <p className="mt-4 text-xl">
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
      <h3>{gameState.casinoBalance}</h3>
      <button onClick={() => guessNumber(1)}>Guess 1</button>
    </div>
  );
};

export default Home;
