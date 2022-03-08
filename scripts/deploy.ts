// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const PaymentSplitter = await ethers.getContractFactory("PaymentSplitter");
  const contract = await PaymentSplitter.deploy(
    [
      "0x9b5ebc2234d4cd089b24f0d8269e6fe7e056bed2",
      "0x289922fbbfbd38472d7e2a1652b33b834f7c0e49",
      "0x8bca8ea29b72323b9e75ea79522b020fd7c02c65",
      "0x2412fcfbf9a9d44abe7619d486b0d21b96b9fbb1",
    ],
    [33, 33, 33, 1]
  );

  await contract.deployed();

  console.log("PaymentSplitter deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
