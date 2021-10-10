import { Card, Upload, Input, Button, Col } from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import { useContractLoader, useContractReader } from "../hooks";
import Account from "./Account";
import AddressInput from "./AddressInput";
import { Transactor } from "../helpers";
import { DEFAULT_CONTRACT_NAME } from "../constants";
const { ethers } = require("ethers");


export default function Minter({
  customContract,
  address,
  gasPrice,
  signer,
  provider,
  name,
  blockExplorer,
}) {
  const contracts = useContractLoader(signer);
  let contract;
  if (!name) {
    name = DEFAULT_CONTRACT_NAME;
  }
  if (!customContract) {
    contract = contracts ? contracts[name] : "";
  } else {
    contract = customContract;
  }

  const contractAddress = contract ? contract.address : "";

  const [creator, setCreator] = useState(null);
  const [price, setPrice] = useState(0);
  // ---
  async function fetchPrice() {

    // scaffold-eth's Transactor helper gives us a nice UI popup when a transaction is sent
    
    const getPrice = await contracts[contract]["price"](creator);
    setPrice(
      ethers.utils.formatEther(getPrice)
    );

  }

  async function mintNFT() {

    // scaffold-eth's Transactor helper gives us a nice UI popup when a transaction is sent
    let overrides = {
      // To convert Ether to Wei:
      value: ethers.utils.parseEther(price)     // ether in this case MUST be a string
    };
    const transactor = Transactor(provider, gasPrice);
    const tx = await transactor(contract.mintToken(creator, overrides));

    // Wait for the transaction to be confirmed, then get the token ID out of the emitted Transfer event.
    const receipt = await tx.wait();
    let tokenId = null;
    for (const event of receipt.events) {
      if (event.event !== 'Transfer') {
        continue
      }
      tokenId = event.args.tokenId.toString();
      break;
    }
    console.log(`Minted token ${tokenId}`);
    return tokenId;
  }
  // ---
  const minterForm = (
    <div style={{ margin: "auto", width: "70vw" }}>
      <AddressInput
        placeholder="enter creator address"
        onChange={newValue => {
          setCreator(newValue);
        }}
      /><br/>
      Price is: {price}
      <Button onClick={fetchPrice}>
        Fetch price
      </Button>
      <Button
        onClick={mintNFT}
      >
        Mint Creator NFT
      </Button>
    </div>
  );


  return minterForm;
}

