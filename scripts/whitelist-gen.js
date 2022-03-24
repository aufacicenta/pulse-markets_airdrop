const { existsSync } = require("fs");
const { resolve, join } = require("path");
const { writeFile, readFile, mkdir } = require("fs/promises");

async function getWhiteListFinalPath(fileName) {
  try {
    const finalDirPath = resolve(join(__dirname, `/../data/`));
    const finalDirPathExists = existsSync(finalDirPath);

    if (!finalDirPathExists) {
      await mkdir(finalDirPath);
    }

    const finalPath = join(finalDirPath, fileName);

    return finalPath;
  } catch (error) {
    throw error;
  }
}

async function getPayeesFromFile(dataSourceFilePath) {
  try {
    const payeesData = await readFile(dataSourceFilePath);
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

async function generateWhiteList() {
  try {
    const args = process.argv.slice(2);

    if (!args.length) {
      throw new Error("At least one parameter is expected: data source file");
    }

    const dataSourceFilePath = args[0];
    const fileName = args[1] || "whitelist.json";
    const shareValue = Number(args[2]) || 150;

    const payees = await getPayeesFromFile(dataSourceFilePath);
    const shares = calculateShares(payees, shareValue);

    const endFilePath = await getWhiteListFinalPath(fileName);
    const data = JSON.stringify({ payees, shares });

    await writeFile(endFilePath, data);

    console.log(`
      JSON GENERATED:
      
        - File Path: ${endFilePath}
        - Payees: ${payees.length}
        - Shares: ${shares.length}
        - Shares value: ${shareValue}
    `);
  } catch (error) {
    throw error;
  }
}

generateWhiteList();
