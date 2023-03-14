import express from "express";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "../Contract/ABI.js";
const contractRouter = express.Router();
const contractAddress = "0xeaA3eC7D8EA8CbcaF57582e399539E0936fC559f";

const privateKey =
  "425123e4ddf546374e9045eee7fafd03a2b07c743593d390904bbe092b8d832f";
const rpcURL =
  // "https://polygon-mumbai.g.alchemy.com/v2/npciD31aUZvxiFyuIBhEToscMCcscV7B"
  "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78";

const getClaim = async (companyID, claimID) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const signer = wallet.connect(provider);
    const contractIntance = new ethers.Contract(
      contractAddress,
      CONTRACT_ABI,
      signer
    );
    let tx = await contractIntance.getClaim(companyID, claimID);
    return {
      id: claimID,
      title: tx[1],
      documentName: tx[0][0].documentName,
      hash: tx[0][0].documentHash,
      timestamp: tx[0][0].timestamp,
      signatures: tx[0][0].signatures,
    };
  } catch (error) {
    console.log(error);
  }
};

contractRouter.get("/get-details", async (req, res) => {
  try {
    const data = await getClaim("FO0001", 0);
    if (data !== "" || data !== undefined) {
      // res.setHeader("Content-Type", "application/json");
      res.status(200).json({ data });
    }
  } catch (err) {
    res.status(500).json({ code: 500, status: "Internal Server Error", err });
  }
  // next();
});

export { contractRouter };
