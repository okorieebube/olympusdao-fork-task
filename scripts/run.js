const hre = require("hardhat");

async function main() {
  [deployer, investor1, investor2, investor3] = await ethers.getSigners();

  let name = "Fanety";
  let symbol = "FANETY";
  let decimals = 18;

  const Fanety = await hre.ethers.getContractFactory("Fanety");
  const fanety = await Fanety.deploy(name, symbol, decimals);

  // 1 ETH equals how many of the token
  let rate = 500;
  // address all funds will be paid to
  let wallet = deployer.address;
  // address of token
  let token = fanety.address;

  const FanetyCrowdsale = await hre.ethers.getContractFactory(
    "FanetyCrowdsale"
  );
  const fanetyCrowdsale = await FanetyCrowdsale.deploy(rate, wallet, token);

  await fanetyCrowdsale.deployed();

  console.log("fanety deployed to:", fanety.address);
  console.log("fanetyCrowdsale deployed to:", fanetyCrowdsale.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
