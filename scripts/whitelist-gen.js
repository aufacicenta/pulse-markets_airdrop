const { readFileSync, writeFileSync } = require("fs");

function getPayeesFromFile(dataSourceFilePath) {
  try {
    const payeesData = readFileSync(dataSourceFilePath);
    const payees = JSON.parse(payeesData.toString("UTF-8"));

    return payees;
  } catch (error) {
    throw error;
  }
}

function calculateShares(payees, shareValue) {
  if (!payees || !payees.length) {
    throw new Error(`Cannot calculate shares from ${payees}`);
  }

  const shares = Array(payees.length).fill(shareValue);
  return shares;
}

function generateWhiteList() {
  const args = process.argv.slice(2);

  if (!args.length) {
    throw new Error("At least one parameter is expected: data source file");
  }

  const dataSourceFilePath = args[0];
  const endFilePath = args[1] || "./whitelist.json";
  const shareValue = Number(args[2]) || 150;

  const payees = getPayeesFromFile(dataSourceFilePath);
  const shares = calculateShares(payees, shareValue);
  const data = JSON.stringify({ payees, shares });

  try {
    writeFileSync(endFilePath, data);
  } catch (error) {
    throw error;
  }
}

generateWhiteList();
