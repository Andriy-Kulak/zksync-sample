## Overview

This is Casino Game. Deployed Contracts:

- MyCoin was deployed to [0xC2c6864bcf1cd4d3A126f1201dA668ba18841D7A](https://goerli.explorer.zksync.io/address/0xa74b31DA52977d5d017B32e5f97aC128C24c6ffd#contrac)
- CasinoGame was deployed to [0x7Eb58E4405c01A47Da2075975fFD1dD75295C043](https://goerli.explorer.zksync.io/address/0xAcDc11Df900624F20A7Fbe85c58cf867C08c279e#contract)
- Lucky Number is 42

## Front-end

- for frontend, please navigate to `frontend/README.md`

## Steps To Set Up Contract Deployment

1. Run `git clone https://github.com/Andriy-Kulak/zksync-sample.git`
2. Run `npm install` at the root folder. Please make sure you have `npm` and `node.js` installed. Look [here](https://nodejs.org/) for more details.
3. Ensure you have a metamask account setup so you can deploy & interact with contract. [Reference](https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask)
4. create `.env` in root folder based on `.env.example` file and add ethescan api key and private key there, specifically `ZKS_PRIVATE_KEY` &

- to generate private key from metamask, refer to [this](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key#:~:text=On%20the%20account%20page%2C%20click,click%20%E2%80%9CConfirm%E2%80%9D%20to%20proceed.) article
- to gerenate etherscan api key, go to [ethescan.io](https://etherscan.io/), generate a new key and paste it

5. `npx hardhat compile` to generate types and artifacts for contract

6. `npx hardhat deploy-zksync` to deploy the contract

7. Check the logs and you should have 2 successful deployed contracts:

```
MyCoin was deployed to 0x...
CasinoGame was deployed to 0x...

```

Now it is time to verify contracts. I've already done the setup for verification so all you nee to do is run the following. Also, for more info, go to [verification docs](https://era.zksync.io/docs/api/hardhat/hardhat-zksync-verify.html#configuration)

```sh
# verify my coin
npx hardhat verify --network zkSyncTestnet {MyCoin address}
# verify casino game. for this one the last 2 are constructor arguments you need to pass
npx hardhat verify --network zkSyncTestnet {CasinoGame address} {MyCoin address} 42

```
