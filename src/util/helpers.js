import { lazyMint } from "./rarible";

export const purchaseContract = async (account, price) => {
  // Generate NFT based on completed USDC call.

  // TODO: pull from mint result.
  let transactionHash = "123";
  let res = {};

  res = await lazyMint(account, price);

  console.log("result", res);

  return {
    ...res,
    transactionHash,
  };
};

export const requestPrice = async (numStations) => {
  return numStations * (40 / 3200); // ~$40 * # stations
};

export const getHashUrl = async () => {
  // TODO: Add link to purchased NFT on explorer.
  return "#";
};
