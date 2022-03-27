import spGas from "../data/spGas.json";
import wpGas from "../data/wpGas.json";
const { join } = require("path");
const { writeFile } = require("fs/promises");

const addressToSharesMap = new Map<string, number>();
let totalGas = 0;

type SharesOfPayess = { payees: string[]; shares: number[] };

function mapAddressToEstimatedGas({
  address,
  estimateGasPaid,
}: {
  address: string;
  estimateGasPaid: string;
}) {
  const gas = addressToSharesMap.get(address);

  let amount = 0;
  if (gas) {
    amount = Number(gas) + Number(estimateGasPaid);
    addressToSharesMap.set(address, amount);
  } else {
    amount = Number(estimateGasPaid);
    addressToSharesMap.set(address, amount);
  }

  totalGas = totalGas + amount;
}

function createPayeesAndSharesObject() {
  const data: SharesOfPayess = {
    payees: [],
    shares: [],
  };

  for (const [address, amount] of addressToSharesMap.entries()) {
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
  mapAddressToEstimatedGas(item);
}

for (const item of wpGas) {
  mapAddressToEstimatedGas(item);
}

(async () => {
  await writeWhitelistFile(JSON.stringify(createPayeesAndSharesObject()));
})();

console.log({ totalGas });
