import { Input, InputNumber, Space } from "antd";
import { Button, Card, Icon, Image, Form } from 'semantic-ui-react'
import { LoadingOutlined } from '@ant-design/icons';
import React, { useState,useEffect, useRef } from "react";
import { useContractLoader } from "../hooks";
import { ethers } from "ethers";
import Hls from "hls.js";
import { useParams } from "react-router-dom";

const DEFAULT_CONTRACT_NAME = "NFTMinter";



export default function Community({
  customContract,
  account,
  gasPrice,
  signer,
  provider,
  name,
  price,
  blockExplorer,
}) {

    const [approved, setApproved] = useState(false);
    const [creator, setCreator] = useState();
  const contracts = useContractLoader(provider);
  let contract;
  if (!name) {
    name = DEFAULT_CONTRACT_NAME;
  }
  if (!customContract) {
    contract = contracts ? contracts[name] : "";
  } else {
    contract = customContract;
  }

  const address = contract ? contract.address : "";

  const videoRef = useRef(null);
  const src = "https://cdn.livepeer.com/hls/f329aeprj69dw4cw/index.m3u8";

  useEffect(() => {
    let hls;
    if (videoRef.current) {
      const video = videoRef.current;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Some browers (safari and ie edge) support HLS natively
        video.src = src;
      } else if (Hls.isSupported()) {
        // This will run in all other modern browsers
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        console.error("This is a legacy browser that doesn't support MSE");
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoRef]);

    async function authenticate() {
        const isNftOwner = await contract.isNftOwner(creator);
        if (isNftOwner) {
            setApproved(true);
        }
    }

    function livestream() {
        return <Form>
          <Form.Field>Enjoy the livestream</Form.Field>
          <Button onClick={() => setApproved(false)}>Exit</Button>
          <video
            controls
            ref={videoRef}
            style={{ width: "100%", maxWidth: "500px" }}
          />
        </Form>
    }

    function auth() {
        return <Form>
            <Form.Field>
                <input onChange={e => setCreator(e.target.value)} placeholder="Enter creator address" />
            </Form.Field>
            <Form.Field>
                <Button onClick={authenticate}>Enter Lobby</Button>
            </Form.Field>
        </Form>
    }

    function show() {
        if (approved) return livestream();
        else return auth();
    }


    return show();
}

