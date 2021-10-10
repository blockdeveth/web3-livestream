import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://nftschool.dev" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🎟 Meme-verse"
        subTitle="create and buy memes"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}

