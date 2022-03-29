import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import moment from "moment";
import { PaymentSplitter } from "../typechain";

describe("PaymentSplitter", function () {
  let contract: PaymentSplitter;

  this.beforeEach(async () => {
    const PaymentSplitter = await ethers.getContractFactory("PaymentSplitter");
    contract = await PaymentSplitter.deploy();
    const payees = [
      "0x9b5ebc2234d4cd089b24f0d8269e6fe7e056bed2",
      "0x289922fbbfbd38472d7e2a1652b33b834f7c0e49",
      "0x8bca8ea29b72323b9e75ea79522b020fd7c02c65",
      "0x2412fcfbf9a9d44abe7619d486b0d21b96b9fbb1",
    ];
    const shares = [33, 33, 33, 1];

    await contract.deployed();
    await contract.setup(payees, shares);
  });

  it("Should return the totalShares as 0", async function () {
    expect(await contract.totalShares()).to.equal(100);
    expect(await contract["totalReleased()"]()).to.equal(0);
  });

  it("Should revert because of timelocked function", async function () {
    const contractBalance = 1;
    const [owner] = await ethers.getSigners();

    await owner.sendTransaction({
      from: owner.address,
      to: contract.address,
      value: contractBalance,
    });

    expect(await contract.owner()).to.equal(owner.address);
    expect(await waffle.provider.getBalance(contract.address)).to.equal(
      contractBalance
    );
    await expect(contract.withdraw(owner.address)).to.be.reverted;
    await expect(contract.withdraw(owner.address)).to.be.revertedWith(
      "PaymentSplitter: function is timelocked"
    );
  });

  it("Should revert because of no remaining funds available", async function () {
    const oneYearFromNow = moment().add(365, "days").unix();
    const [owner] = await ethers.getSigners();

    await ethers.provider.send("evm_increaseTime", [oneYearFromNow]);

    expect(await contract.owner()).to.equal(owner.address);
    expect(await waffle.provider.getBalance(contract.address)).to.equal(0);
    await expect(contract.withdraw(owner.address)).to.be.reverted;
    await expect(contract.withdraw(owner.address)).to.be.revertedWith(
      "PaymentSplitter: no remaining funds available"
    );
  });

  it("Should send remaining contract balance to owner", async function () {
    const contractBalance = 1;
    const oneYearFromNow = moment().add(365, "days").unix();
    const [owner] = await ethers.getSigners();

    await owner.sendTransaction({
      from: owner.address,
      to: contract.address,
      value: contractBalance,
    });
    await ethers.provider.send("evm_increaseTime", [oneYearFromNow]);

    expect(await contract.owner()).to.equal(owner.address);
    expect(await waffle.provider.getBalance(contract.address)).to.equal(
      contractBalance
    );

    await contract.withdraw(owner.address);

    expect(await waffle.provider.getBalance(contract.address)).to.equal(0);
  });

  it("Should revert since caller is not owner", async function () {
    const contractBalance = 1;
    const oneYearFromNow = moment().add(365, "days").unix();
    const [owner, account1] = await ethers.getSigners();

    await owner.sendTransaction({
      from: owner.address,
      to: contract.address,
      value: contractBalance,
    });
    await ethers.provider.send("evm_increaseTime", [oneYearFromNow]);

    await expect(contract.connect(account1).withdraw(account1.address)).to.be
      .reverted;
    await expect(
      contract.connect(account1).withdraw(account1.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
