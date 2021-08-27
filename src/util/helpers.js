import { RARIBLE_BASE_URL, ROPSTEN_COLLECTION, URI } from "./constants";
import { createLazyMint, generateTokenId, putLazyMint } from "./createLazyMint";
import { lazyMint } from "./rarible";
import nanoIpfs from "nano-ipfs-store";
import { getStationName } from "../data/stations";

const ipfs = nanoIpfs.at("https://ipfs.infura.io:5001");

export const purchaseContract = async (
  stations,
  account,
  price,
  web3,
  ipfsHash
) => {
  // Generate NFT based on completed USDC call.

  const description = `Travel from ${getStationName(
    stations[0]
  )} to ${getStationName(stations[stations.length - 1])}`;

  const doc = JSON.stringify({
    name: "FarePass NFT",
    description,
    image: "ipfs://ipfs/" + URI,
  });

  const cid = await ipfs.add(doc);

  console.log("IPFS cid:", cid);

  // console.log(await ipfs.cat(cid));

  const newTokenId = await generateTokenId(ROPSTEN_COLLECTION, account);

  console.log("sending", newTokenId);
  const form = await createLazyMint(
    newTokenId,
    web3.currentProvider,
    ROPSTEN_COLLECTION,
    account,
    ipfsHash || cid
  );

  console.log("lazyMint", form);

  let res = {};
  res = await putLazyMint(form);

  // res = await lazyMint(account, price);
  console.log("result", res.id, res);
  return { hash: res.id };
};

export const requestPrice = async (numStations) => {
  return numStations * (40 / 3200); // ~$40 * # stations
};

export const getHashUrl = (hash) => {
  // TODO: Add link to purchased NFT on explorer.
  return `${RARIBLE_BASE_URL}/token/${hash}`;
};
