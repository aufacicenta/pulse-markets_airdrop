import spGas from "../data/spGas.json";
import wpGas from "../data/wpGas.json";
const { join } = require("path");
const { writeFile } = require("fs/promises");

const payeesSet = new Set<string>();

// 50K USD > ETH at Mar 27, 2022 23:12 CST
const totalGas = BigInt(15110000000000000000);

type SharesOfPayess = { payees: string[]; shares: number[] };

function createPayeesAndSharesObject(amount: number) {
  const data: SharesOfPayess = {
    payees: [],
    shares: [],
  };

  for (const address of payeesSet) {
    data.payees.push(address);
    data.shares.push(amount);
  }

  console.log({
    data,
    "payees.length": data.payees.length,
    "shares.length": data.shares.length,
  });

  return data;
}

async function writeWhitelistFile(data: string) {
  const file = join(__dirname, `/../data/whitelist.json`);
  await writeFile(file, data);
}

for (const item of spGas) {
  payeesSet.add(item.address);
}

for (const item of wpGas) {
  payeesSet.add(item.address);
}

(async () => {
  await writeWhitelistFile(JSON.stringify(createPayeesAndSharesObject(1)));
})();

console.log({ totalGas: totalGas.toString() });
