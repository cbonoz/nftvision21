export const purchaseContract = async () => {
  // Generate hash based on USDC call.

  const transactionHash = "123";

  return {
    transactionHash,
  };
};

export const requestPrice = async (positionList, start, end) => {
  return positionList.length * 40;
};
export const getLastPrice = async () => {};
export const getHashUrl = async () => {
  // TODO: Add link to purchased NFT on explorer.
  return "#";
};
