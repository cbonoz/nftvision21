import { NFT_TYPE, ROPSTEN_COLLECTION, TARGET_NETWORK, URI } from "./constants";

import { toAddress, toBigNumber } from "@rarible/types";
import Web3 from "web3";

import { SellRequest } from "@rarible/protocol-ethereum-sdk/build/order/sell";
import React, { useState } from "react";
import { NftItem } from "@rarible/protocol-api-client";
import { SimpleOrder } from "@rarible/protocol-ethereum-sdk/build/order/sign-order";
import { createRaribleSdk, RaribleSdk } from "@rarible/protocol-ethereum-sdk";
// https://github.com/rarible/protocol-example

let sdk;


export const initSdk = (web3) => {
  sdk = createRaribleSdk(new Web3({ web3 }), TARGET_NETWORK);
  console.log("init rarible", TARGET_NETWORK, sdk);
};

// https://github.com/rarible/protocol-example

// https://github.com/rarible/protocol-example/blob/f1c1c1c71069345a6dfd7db32e0babf934a831c9/src/Dashboard.tsx#L26
export const lazyMint = async (account, price, hash, ipfsUrl, supply) => {
  console.log("mint", account, price, hash);
  if (!sdk) {
    throw new Error("Rarible not initialized");
  }
  const item = await sdk?.nft.mintLazy({
    "@type": NFT_TYPE, // type of NFT to mint
    contract: toAddress(ROPSTEN_COLLECTION),
    uri: ipfsUrl || URI, // todo: replace with potential user asset.
    // supply: supply || 1,
    // uri: , // tokenUri, url to media that nft stores
    creators: [{ account: toAddress(account), value: 10000 }], // list of creators
    royalties: [], // royalties
  });
  console.log("minted", item);
  let body = {};
  if (item) {
    /**
     * Get minted nft through SDK
     */
    const token =
      (await sdk?.apis.nftItem.getNftItemById({ itemId: item.id })) || {};

    body = {
      price,
      hash,
      contract: token.contract,
      tokenId: token.tokenId,
    };
  }
  console.log("contract", body);
  return body;
};

export const createSellOrder = async (account, createOrderForm) => {
  // Orderform from lazyMint
  if (
    createOrderForm.contract &&
    createOrderForm.tokenId &&
    createOrderForm.price
  ) {
    // Create an order
    const resultOrder = await sdk?.order
      .sell({
        makeAssetType: {
          assetClass: NFT_TYPE,
          contract: toAddress(createOrderForm.contract),
          tokenId: toBigNumber(createOrderForm.tokenId),
        }, // asset type, must includes contract address and tokenId
        amount: 1, // amount to sell, in our case for ERC721 always will be 1
        maker: toAddress(account), // who sell an item
        originFees: [], // fees description
        payouts: [], // payouts
        price: toBigNumber(createOrderForm.price),
        takeAssetType: { assetClass: "ETH" }, // for what currency
      })
      .then((a) => a.runAll());

    return { resultOrder }; // purchaseOrderForm
  }
};

export const handlePurchaseOrder = async ({
  resultOrder,
  purchaseOrderForm,
}) => {
  return await sdk?.order
    .fill(resultOrder, { amount: parseInt(purchaseOrderForm.amount) })
    .then((a) => a.runAll());
};

export const handleGetMyNfts = async (accounts) => {
  const items = await sdk?.apis.nftItem.getNftItemsByOwner({
    owner: accounts[0],
  });

  return items?.items;
};
