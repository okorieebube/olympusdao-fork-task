const { expect } = require("chai");
const { ethers } = require("hardhat");
const {latestTime} = require("../helpers/latest-time")
const {increaseTimeTo, duration} = require("../helpers/increase-time")

describe("FanetyCrowdsale contract", async function () {
  before(async () => {
    [
      deployer,
      investor,
      PrivatePresaleAddress,
      DexesLiquidityAddress,
      CexesLiquidityAddress,
      MarketingAndCreatorsAddress,
      PlatformDevelopmentAddress,
      TeamAndEmployeesAddress,
      AdvisorsAddress,
      LiquidityAndReservesAddress,
    ] = await ethers.getSigners();

    // TOKEN CONFIG
    _name = "Fanety";
    _symbol = "FANETY";
    _decimals = 18;
    _initialSupply = "3000000000000000000000000"; // 3,000,000 000000000000000000 = 3million

    Fanety = await hre.ethers.getContractFactory("Fanety");
    fanety = await Fanety.deploy(_initialSupply);

    // TOKEN DISTRIBUTION
    _PrivatePresale = 8;
    _DexesLiquidity = 20;
    _CexesLiquidity = 20;
    _MarketingAndCreators = 16;
    _PlatformDevelopment = 13;
    _TeamAndEmployees = 12;
    _Advisors = 7;
    _LiquidityAndReserves = 4;

    // CROWDSALE CONFIG
    _rate = 500;
    _wallet = deployer.address;
    _token = fanety.address;
    _releaseTime = await latestTime() + duration.weeks(1);
    console.log({"deployer":deployer.address});

    // DEPLOY CROWDSALE
    FanetyCrowdsale = await hre.ethers.getContractFactory("FanetyCrowdsale");
    fanetyCrowdsale = await FanetyCrowdsale.deploy(
      _rate,
      _wallet,
      _token,
      PrivatePresaleAddress.address,
      DexesLiquidityAddress.address,
      CexesLiquidityAddress.address,
      MarketingAndCreatorsAddress.address,
      PlatformDevelopmentAddress.address,
      TeamAndEmployeesAddress.address,
      AdvisorsAddress.address,
      LiquidityAndReservesAddress.address,
      _releaseTime
    );
    // await fanetyCrowdsale.distributeAndLockTokens();

    
  });

  describe("Crowdsale setup", () => {
    it("should have the correct rate", async function () {
      let rate = await fanetyCrowdsale.rate();
      expect(rate).to.equal(_rate);
    });
    it("should have the correct wallet for payment", async function () {
      let wallet = await fanetyCrowdsale.wallet();
      expect(wallet).to.equal(_wallet);
    });
    it("should have the correct token  address", async function () {
      let token = await fanetyCrowdsale.token();
      expect(token).to.equal(_token);
    });
  });

  describe("Token distribution", () => {
    it("should be distributed correctly", async function () {
      let PrivatePresale = await fanetyCrowdsale.PrivatePresale();
      expect(PrivatePresale).to.equal(_PrivatePresale);
      let DexesLiquidity = await fanetyCrowdsale.DexesLiquidity();
      expect(DexesLiquidity).to.equal(_DexesLiquidity);
      let CexesLiquidity = await fanetyCrowdsale.CexesLiquidity();
      expect(CexesLiquidity).to.equal(_CexesLiquidity);
      let MarketingAndCreators = await fanetyCrowdsale.MarketingAndCreators();
      expect(MarketingAndCreators).to.equal(_MarketingAndCreators);
      let PlatformDevelopment = await fanetyCrowdsale.PlatformDevelopment();
      expect(PlatformDevelopment).to.equal(_PlatformDevelopment);
      let TeamAndEmployees = await fanetyCrowdsale.TeamAndEmployees();
      expect(TeamAndEmployees).to.equal(_TeamAndEmployees);
      let Advisors = await fanetyCrowdsale.Advisors();
      expect(Advisors).to.equal(_Advisors);
      let LiquidityAndReserves = await fanetyCrowdsale.LiquidityAndReserves();
      expect(LiquidityAndReserves).to.equal(_LiquidityAndReserves);
    });
    it("should equal hundered percent", async function () {
      let PrivatePresale = await fanetyCrowdsale.PrivatePresale();
      let DexesLiquidity = await fanetyCrowdsale.DexesLiquidity();
      let CexesLiquidity = await fanetyCrowdsale.CexesLiquidity();
      let MarketingAndCreators = await fanetyCrowdsale.MarketingAndCreators();
      let PlatformDevelopment = await fanetyCrowdsale.PlatformDevelopment();
      let TeamAndEmployees = await fanetyCrowdsale.TeamAndEmployees();
      let Advisors = await fanetyCrowdsale.Advisors();
      let LiquidityAndReserves = await fanetyCrowdsale.LiquidityAndReserves();
      /* 
      let total_supply = await fanety.totalSupply();
      console.log((total_supply.toNumber()).toString());
 */
      let total =
        Number(PrivatePresale) +
        Number(DexesLiquidity) +
        Number(CexesLiquidity) +
        Number(MarketingAndCreators) +
        Number(PlatformDevelopment) +
        Number(TeamAndEmployees) +
        Number(Advisors) +
        Number(LiquidityAndReserves);
      expect(total).to.equal(100);
    });
  });
});
