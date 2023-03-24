import * as dotenv from "dotenv";
dotenv.config();

import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// Get private key from the environment variable
const PRIVATE_KEY: string = process.env.ZKS_PRIVATE_KEY || "";

if (!PRIVATE_KEY) {
  throw new Error("Please set ZKS_PRIVATE_KEY in the environment variables.");
}

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the MyCoin & CasinoGame contracts`);

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const myCoinArtifact = await deployer.loadArtifact("MyCoin");
  const casinoGameArtifact = await deployer.loadArtifact("CasinoGame");

  const myCoinContract = await deployer.deploy(myCoinArtifact, []);

  console.log(
    `${myCoinArtifact.contractName} was deployed to ${myCoinContract.address}`
  );

  // for testing & info purposes only. please don't pass secrets into the contract
  const secretNumber = 42;

  // deploy CasinoGame
  const casinoGameContract = await deployer.deploy(casinoGameArtifact, [
    myCoinContract.address,
    secretNumber,
  ]);

  console.log(
    `${casinoGameArtifact.contractName} was deployed to ${casinoGameContract.address}`
  );

  console.log("minting 1_000_000 tokens to the casino game...");

  // transfer 1_000_000 tokens to the casino game
  const tx = await myCoinContract
    .connect(deployer.zkWallet)
    .mintToAccount(
      casinoGameContract.address,
      ethers.utils.parseEther("1000000")
    );

  console.log("minting completed...");
}
