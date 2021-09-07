import axios from "axios";

const DIMENSION = "128x128";
// const QR_CODE_URL = "https://api.qr-code-generator.com/v1/create/";
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=${DIMENSION}&data=`;

export const createQRImage = async (url) => {
  const qrUrl = `${QR_CODE_URL}${url}`;
  const imageBlob = await axios.get(qrUrl, { responseType: "blob" });
  return URL.createObjectURL(imageBlob.data);
};
