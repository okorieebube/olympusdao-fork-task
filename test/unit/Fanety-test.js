const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fanety contract", function () {
  before(async () => {
    _name = "Fanety";
    _symbol = "FANETY";
    _decimals = 18;
    _initialSupply = '3000000000000000000000000000'; // 3,000,000,000 000000000000000000 = 3million

    Fanety = await hre.ethers.getContractFactory("Fanety");
    fanety = await Fanety.deploy(_initialSupply);
  });

  it("should have the correct name", async function () {
    let name = await fanety.name();
    expect(name).to.equal(_name);
  });
  it("should have the correct symbol", async function () {
    let symbol = await fanety.symbol();
    expect(symbol).to.equal(_symbol);
  });
  it("should have the correct decimals", async function () {
    let decimals = await fanety.decimals();
    expect(decimals).to.equal(_decimals);
  });

});
