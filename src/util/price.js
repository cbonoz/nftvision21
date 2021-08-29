// https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd

import axios from "axios";

export const getPrice = async (coinId) => {
  // ex id: ethereum
  const data = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
  );

  console.log("getPrice", coinId, data.data);
  return data.data[coinId]["usd"];
};
