export const APP_NAME = "FarePass";
export const APP_DESC = "Your fare as an NFT powered by USDC and Rarible.";

export const TARGET_NETWORK = process.env.REACT_APP_ETH_NETWORK || "ropsten";

// https://docs.rarible.org/contract-addresses
export const ROPSTEN_COLLECTION = "0x6a94aC200342AC823F909F142a65232E2f052183";

export const CIRCLE_BASE_URL =
  process.env.REACT_APP_CIRCLE_URL || "https://api-sandbox.circle.com";

export const URI = "QmahXDURdiRW4PFEfdmSSZj4qU6Lr7UYxe1yRPSoK4bTbn";

export const NFT_TYPE = "ERC721"; // "ERC1155"; // ERC721

export const RARIBLE_BASE_URL = `https://${TARGET_NETWORK}.rarible.com`
