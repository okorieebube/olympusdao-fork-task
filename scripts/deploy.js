const hre = require("hardhat");

async function main() {
  let name = "Fanety";
  let symbol = "FANETY";
  let decimals = 18;
  // We get the contract to deploy
  const Fanety = await hre.ethers.getContractFactory("Fanety");
  const fanety = await Fanety.deploy(name, symbol, decimals);

  await fanety.deployed();

  console.log("fanety deployed to:", fanety.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
