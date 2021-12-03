const { expect } = require("chai");
const { ethers } = require("hardhat");
const { latestTime } = require("../helpers/latest-time");
const { increaseTimeTo, duration } = require("../helpers/increase-time");
const { BigNumber } = require("@ethersproject/bignumber");
const { utils } = require("ethers");

describe("FanetyCrowdsale contract", async function () {
  before(async () => {
    [
      deployer,
      investor1,
      investor2,
      investor3,
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
    FanetyCrowdsale = await hre.ethers.getContractFactory("FanetyCrowdsale");
    TokenTimelock = await hre.ethers.getContractFactory("TokenTimelock");

    // DEPLOY TOKEN
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
    _releaseTime = (await latestTime()) + duration.weeks(1); //  1 week from deployment

    // DEPLOY CROWDSALE
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

    // TRANSFER TOKENS FROM DEPLOYER TO CROWDSALE CONTRACT
    await fanety
      .connect(deployer)
      .transfer(fanetyCrowdsale.address, _initialSupply);

    // DISTRIBUTE TOKENS VIA TOKENOMICS
    await fanetyCrowdsale.distributeAndLockTokens();
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

    it("the deployer balance should equal zero", async function () {
      let balance = await fanety.balanceOf(deployer.address);
      expect(balance).to.equal(0);
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
    it("should only be done by deployer", async function () {
      await expect(
        fanetyCrowdsale.connect(investor1).distributeAndLockTokens()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Token timelock", () => {
    it("address balances should equal their equivalent percentage", async function () {
      const PrivatePresaleTimelock =
        await fanetyCrowdsale.PrivatePresaleTimelock();
      const PrivatePresaleTimelockBalance = await fanety.balanceOf(
        PrivatePresaleTimelock
      );
      expect(Number(PrivatePresaleTimelockBalance)).to.equal(
        (_PrivatePresale * Number(_initialSupply)) / 100
      );

      const DexesLiquidityTimelock =
        await fanetyCrowdsale.DexesLiquidityTimelock();
      const DexesLiquidityTimelockBalance = await fanety.balanceOf(
        DexesLiquidityTimelock
      );
      expect(Number(DexesLiquidityTimelockBalance)).to.equal(
        (_DexesLiquidity * Number(_initialSupply)) / 100
      );

      const CexesLiquidityTimelock =
        await fanetyCrowdsale.CexesLiquidityTimelock();
      const CexesLiquidityTimelockBalance = await fanety.balanceOf(
        CexesLiquidityTimelock
      );
      expect(Number(CexesLiquidityTimelockBalance)).to.equal(
        (_CexesLiquidity * Number(_initialSupply)) / 100
      );

      const MarketingAndCreatorsTimelock =
        await fanetyCrowdsale.MarketingAndCreatorsTimelock();
      const MarketingAndCreatorsTimelockBalance = await fanety.balanceOf(
        MarketingAndCreatorsTimelock
      );
      expect(Number(MarketingAndCreatorsTimelockBalance)).to.equal(
        (_MarketingAndCreators * Number(_initialSupply)) / 100
      );

      const PlatformDevelopmentTimelock =
        await fanetyCrowdsale.PlatformDevelopmentTimelock();
      const PlatformDevelopmentTimelockBalance = await fanety.balanceOf(
        PlatformDevelopmentTimelock
      );
      expect(Number(PlatformDevelopmentTimelockBalance)).to.equal(
        (_PlatformDevelopment * Number(_initialSupply)) / 100
      );

      const TeamAndEmployeesTimelock =
        await fanetyCrowdsale.TeamAndEmployeesTimelock();
      const TeamAndEmployeesTimelockBalance = await fanety.balanceOf(
        TeamAndEmployeesTimelock
      );
      expect(Number(TeamAndEmployeesTimelockBalance)).to.equal(
        (_TeamAndEmployees * Number(_initialSupply)) / 100
      );
      /* 
        const AdvisorsTimelock =
          await fanetyCrowdsale.AdvisorsTimelock();
        const AdvisorsTimelockBalance = await fanety.balanceOf(
          AdvisorsTimelock
        );
        console.log(_Advisors * Number(_initialSupply));
        console.log((_Advisors * Number(_initialSupply)) / 100);
        expect(Number(AdvisorsTimelockBalance)).to.equal(
          (_Advisors * Number(_initialSupply)) / 100
        );
      */
      const LiquidityAndReservesTimelock =
        await fanetyCrowdsale.LiquidityAndReservesTimelock();
      const LiquidityAndReservesTimelockBalance = await fanety.balanceOf(
        LiquidityAndReservesTimelock
      );
      expect(Number(LiquidityAndReservesTimelockBalance)).to.equal(
        (_LiquidityAndReserves * Number(_initialSupply)) / 100
      );
    });

    it("should not allow token withdrawal before release time", async function () {
      let PrivatePresaleTimelock = await TokenTimelock.attach(
        await fanetyCrowdsale.PrivatePresaleTimelock()
      );
      await expect(
        PrivatePresaleTimelock.connect(deployer).release()
      ).to.be.revertedWith(
        "TokenTimelock: current time is before release time"
      );

      let DexesLiquidityTimelock = await TokenTimelock.attach(
        await fanetyCrowdsale.DexesLiquidityTimelock()
      );
      await expect(
        DexesLiquidityTimelock.connect(deployer).release()
      ).to.be.revertedWith(
        "TokenTimelock: current time is before release time"
      );
      let CexesLiquidityTimelock = await TokenTimelock.attach(
        await fanetyCrowdsale.CexesLiquidityTimelock()
      );
      await expect(
        CexesLiquidityTimelock.connect(deployer).release()
      ).to.be.revertedWith(
        "TokenTimelock: current time is before release time"
      );
      let MarketingAndCreatorsTimelock = await TokenTimelock.attach(
        await fanetyCrowdsale.MarketingAndCreatorsTimelock()
      );
      await expect(
        MarketingAndCreatorsTimelock.connect(deployer).release()
      ).to.be.revertedWith(
        "TokenTimelock: current time is before release time"
      );

      let PlatformDevelopmentTimelock = await TokenTimelock.attach(
        await fanetyCrowdsale.PlatformDevelopmentTimelock()
      );
      await expect(
        PlatformDevelopmentTimelock.connect(deployer).release()
      ).to.be.revertedWith(
        "TokenTimelock: current time is before release time"
      );
      let TeamAndEmployeesTimelock = await TokenTimelock.attach(
        await fanetyCrowdsale.TeamAndEmployeesTimelock()
      );
      await expect(
        TeamAndEmployeesTimelock.connect(deployer).release()
      ).to.be.revertedWith(
        "TokenTimelock: current time is before release time"
      );
      let AdvisorsTimelock = await TokenTimelock.attach(
        await fanetyCrowdsale.AdvisorsTimelock()
      );
      await expect(
        AdvisorsTimelock.connect(deployer).release()
      ).to.be.revertedWith(
        "TokenTimelock: current time is before release time"
      );
      let LiquidityAndReservesTimelock = await TokenTimelock.attach(
        await fanetyCrowdsale.LiquidityAndReservesTimelock()
      );
      await expect(
        LiquidityAndReservesTimelock.connect(deployer).release()
      ).to.be.revertedWith(
        "TokenTimelock: current time is before release time"
      );
    });
    it("should allow token withdrawal once its release time", async function () {
      await increaseTimeTo(_releaseTime + 1);

      let PrivatePresaleTimelockAddress =
        await fanetyCrowdsale.PrivatePresaleTimelock();
      let PrivatePresaleTimelock = await TokenTimelock.attach(
        PrivatePresaleTimelockAddress
      );
      await PrivatePresaleTimelock.connect(deployer).release();
      let PrivatePresaleTimelockBalance = await fanety.balanceOf(
        PrivatePresaleTimelockAddress
      );
      expect(BigNumber.from(PrivatePresaleTimelockBalance)).to.equal(0);
      let PrivatePresaleBalance =
        (await fanety.balanceOf(PrivatePresaleAddress.address)) /
        10 ** _decimals;
      expect(PrivatePresaleBalance).to.equal(
        (_PrivatePresale * BigNumber.from(_initialSupply / 10 ** _decimals)) /
          100
      );
    });
  });

  describe("Token Crowdsale", () => {
    before(async function () {
      // token vesting period should be over
      // token will be released from presale lock
      // token will be sent to crowdsale address

    });
    // it("should allow users to buy token", async function () {
    //   let purchaseToken = await fanetyCrowdsale
    //     .connect(investor1)
    //     .buyTokens(investor1.address, { value: ethers.utils.parseEther('1') });
    //     console.log(purchaseToken)
    // });
  });
});
