const TARGET_NETWORK = process.env.REACT_APP_ETH_NETWORK;

const PINATA_API_KEY = "";
const PINATA_API_SECRET = "";

// We first create an instance of the sdk which will use 'rinkeby' by default (can also use 'mainnet' // todo currently unfinished as need contract addresses)
const raribleSDK = new RaribleSDK("rinkeby"); // using 'mainnet' will currently not work (//todo needs the right contract addresses)

console.log("rarible", TARGET_NETWORK);

const mintNft = async (nftName, nftDesc, myAddress) => {
  // We next have to upload an image to ipfs. This will return a hash which will we will then use to upload ALL the metadata to ipfs (2 calls altogether)
  // you will currently need an account with pinata https://pinata.cloud/ // todo could add other services
  // you will need to create a way of passing in a local path to the file // todo could add a cloud based url like aws s3
  const imageIpfsUploadResponse = await raribleSDK.uploadImageToIPFS(
    PINATA_API_KEY,
    PINATA_API_SECRET,
    "./tests/testData/beeplz.jpg"
  );
  const { IpfsHash } = imageIpfsUploadResponse;

  // Next we have to use the hash generated above to post the metadata to ipfs
  const ipfsMetaData = await raribleSDK.addMetaDataToIPFS(
    PINATA_API_KEY,
    PINATA_API_SECRET,
    nftName,
    nftDesc,
    IpfsHash
  );

  // Finally we need to submit the data to Rarible. You will need to pass in a web3 object (see here: https://github.com/ChainSafe/web3.js) // todo could add other providers such as ethers
  // todo I'm currently  not quite sure how to get the tokenId
  const result = await raribleSDK.lazyMintNFT(
    web3,
    myAddress,
    "ERC721",
    tokenId,
    ipfsMetaData
  );

  return result;
};
