import spGas from "../data/spGas.json";
import wpGas from "../data/wpGas.json";
const { join } = require("path");
const { writeFile } = require("fs/promises");

const payeesSet = new Set<string>();

// 50K USD > ETH at Mar 27, 2022 23:12 CST
const totalGas = BigInt(15110000000000000000);

type SharesOfPayess = { payees: string[]; shares: number[] };

function createPayeesAndSharesObject(
  amount: number,
  start: number,
  end: number
) {
  const payees = Array.from(payeesSet).slice(start, end);

  const data: SharesOfPayess = {
    payees: [],
    shares: [],
  };

  for (const address of payees) {
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

async function writeWhitelistFile(data: string, id: string) {
  const file = join(__dirname, `/../data/whitelist-${id}.json`);
  await writeFile(file, data);
}

for (const item of spGas) {
  payeesSet.add(item.address);
}

for (const item of wpGas) {
  payeesSet.add(item.address);
}

(async () => {
  await writeWhitelistFile(
    JSON.stringify(createPayeesAndSharesObject(1, 0, 91)),
    "1"
  );
  await writeWhitelistFile(
    JSON.stringify(createPayeesAndSharesObject(1, 91, 91 * 2)),
    "2"
  );
  await writeWhitelistFile(
    JSON.stringify(createPayeesAndSharesObject(1, 91 * 2, 91 * 3)),
    "3"
  );
  await writeWhitelistFile(
    JSON.stringify(createPayeesAndSharesObject(1, 91 * 3, 91 * 4)),
    "4"
  );
  await writeWhitelistFile(
    JSON.stringify(createPayeesAndSharesObject(1, 91 * 4, 91 * 5)),
    "5"
  );
  await writeWhitelistFile(
    JSON.stringify(createPayeesAndSharesObject(1, 91 * 5, 91 * 6)),
    "6"
  );
})();

console.log({ totalGas: totalGas.toString() });
