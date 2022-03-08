import { expect } from "chai";
import { ethers } from "hardhat";

describe("PaymentSplitter", function () {
  it("Should return the totalShares as 0", async function () {
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

    expect(await contract.totalShares()).to.equal(100);
    expect(await contract["totalReleased()"]()).to.equal(0);
  });

  it("Should revert because of payees and shares mismatch", async function () {
    const PaymentSplitter = await ethers.getContractFactory("PaymentSplitter");
    const adresses = ["0x9b5ebc2234d4cd089b24f0d8269e6fe7e056bed2"];
    const shares = [25, 25, 25, 25];

    await expect(PaymentSplitter.deploy(adresses, shares)).to.be.reverted;
    await expect(PaymentSplitter.deploy(adresses, shares)).to.be.revertedWith(
      "PaymentSplitter: payees and shares length mismatch"
    );
  });
});
