import { Card, Upload, Input, Button, Col } from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import { useContractLoader, useContractReader } from "../hooks";
import Account from "./Account";
import AddressInput from "./AddressInput";
import { Transactor } from "../helpers";
import { DEFAULT_CONTRACT_NAME } from "../constants";

const { ethers } = require("ethers");



export default function Creator({
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

  const [price, setPrice] = useState(0);
  // ---
  async function addCreator() {

    const transactor = Transactor(provider, gasPrice);
    const tx = await transactor(contract.mintToken(ethers.utils.parseEther(price)));

    // Wait for the transaction to be confirmed, then get the token ID out of the emitted Transfer event.
    const receipt = await tx.wait();
  }
  // ---
  const minterForm = (
    <div style={{ margin: "auto", width: "70vw" }}>
      <Input
        placeholder="enter your price"
        onChange={newValue => {
          addCreator(newValue);
        }}
      /><br/>
      Price is: {price}
      <Button onClick={fetchPrice}>
        Set price
      </Button>
    </div>
  );


  return minterForm;
}

