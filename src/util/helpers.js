import { RARIBLE_BASE_URL, ROPSTEN_COLLECTION, URI } from "./constants";
import { createLazyMint, generateTokenId, putLazyMint } from "./createLazyMint";
import { lazyMint } from "./rarible";

export const purchaseContract = async (account, price, web3, ipfsHash) => {
  // Generate NFT based on completed USDC call.

  const newTokenId = await generateTokenId(ROPSTEN_COLLECTION, account);

  console.log("sending", newTokenId);
  const form = await createLazyMint(
    newTokenId,
    web3.currentProvider,
    ROPSTEN_COLLECTION,
    account,
    ipfsHash || URI
  );

  console.log("lazyMint", form);

  let res = {};
  res = await putLazyMint(form);

  // TODO: pull from mint result.
  let transactionHash = res.id;

  // res = await lazyMint(account, price);

  console.log("result", res);

  return {
    ...res,
    transactionHash,
  };
};

export const requestPrice = async (numStations) => {
  return numStations * (40 / 3200); // ~$40 * # stations
};

export const getHashUrl = async (id) => {
  // TODO: Add link to purchased NFT on explorer.
  return `${RARIBLE_BASE_URL}/token/${id}`;
};
