// SPDX-License-Identifier: MIT
pragma solidity 0.5.5;
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/TokenTimelock.sol";
import "hardhat/console.sol";

contract FanetyCrowdsale is Crowdsale, Ownable {
    // TOKEN DISTRIBUTION
    uint256 public PrivatePresale = 8;
    uint256 public DexesLiquidity = 20;
    uint256 public CexesLiquidity = 20;
    uint256 public MarketingAndCreators = 16;
    uint256 public PlatformDevelopment = 13;
    uint256 public TeamAndEmployees = 12;
    uint256 public Advisors = 7;
    uint256 public LiquidityAndReserves = 4;

    // ADDRESS OF FUNDS GETTING SHARES OF TOKEN
    address public PrivatePresaleAddress;
    address public DexesLiquidityAddress;
    address public CexesLiquidityAddress;
    address public MarketingAndCreatorsAddress;
    address public PlatformDevelopmentAddress;
    address public TeamAndEmployeesAddress;
    address public AdvisorsAddress;
    address public LiquidityAndReservesAddress;

    // TOKEN TIME LOCK
    uint256 public releaseTime;
    TokenTimelock public PrivatePresaleTimelock;
    TokenTimelock public DexesLiquidityTimelock;
    TokenTimelock public CexesLiquidityTimelock;
    TokenTimelock public MarketingAndCreatorsTimelock;
    TokenTimelock public PlatformDevelopmentTimelock;
    TokenTimelock public TeamAndEmployeesTimelock;
    TokenTimelock public AdvisorsTimelock;
    TokenTimelock public LiquidityAndReservesTimelock;

    IERC20 Fanetytoken;

    constructor(
        uint256 rate,
        address payable wallet, // Address where users send funds to
        IERC20 token, // address of token to be sold
        address _PrivatePresaleAddress,
        address _DexesLiquidityAddress,
        address _CexesLiquidityAddress,
        address _MarketingAndCreatorsAddress,
        address _PlatformDevelopmentAddress,
        address _TeamAndEmployeesAddress,
        address _AdvisorsAddress,
        address _LiquidityAndReservesAddress,
        uint256 _releaseTime
    ) public Crowdsale(rate, wallet, token) {
        PrivatePresaleAddress = _PrivatePresaleAddress;
        DexesLiquidityAddress = _DexesLiquidityAddress;
        CexesLiquidityAddress = _CexesLiquidityAddress;
        MarketingAndCreatorsAddress = _MarketingAndCreatorsAddress;
        PlatformDevelopmentAddress = _PlatformDevelopmentAddress;
        TeamAndEmployeesAddress = _TeamAndEmployeesAddress;
        AdvisorsAddress = _AdvisorsAddress;
        LiquidityAndReservesAddress = _LiquidityAndReservesAddress;
        Fanetytoken = token;
        releaseTime = _releaseTime;
    }

    /**
     * will be called by owner when crowdsale has been completed, to transfer the tokens
     */
    function distributeAndLockTokens() public onlyOwner {
        IERC20 _FanetyToken = IERC20(Fanetytoken);
        uint256 totalSupply = _FanetyToken.totalSupply();

        // create a locked vault address to store their tokens
        PrivatePresaleTimelock = new TokenTimelock(
            Fanetytoken,
            PrivatePresaleAddress,
            releaseTime
        );
        DexesLiquidityTimelock = new TokenTimelock(
            Fanetytoken,
            DexesLiquidityAddress,
            releaseTime
        );
        CexesLiquidityTimelock = new TokenTimelock(
            Fanetytoken,
            CexesLiquidityAddress,
            releaseTime
        );
        MarketingAndCreatorsTimelock = new TokenTimelock(
            Fanetytoken,
            MarketingAndCreatorsAddress,
            releaseTime
        );
        PlatformDevelopmentTimelock = new TokenTimelock(
            Fanetytoken,
            PlatformDevelopmentAddress,
            releaseTime
        );
        TeamAndEmployeesTimelock = new TokenTimelock(
            Fanetytoken,
            TeamAndEmployeesAddress,
            releaseTime
        );
        AdvisorsTimelock = new TokenTimelock(
            Fanetytoken,
            AdvisorsAddress,
            releaseTime
        );
        LiquidityAndReservesTimelock = new TokenTimelock(
            Fanetytoken,
            LiquidityAndReservesAddress,
            releaseTime
        );


        _FanetyToken.transfer(
            address(PrivatePresaleTimelock),
            totalSupply.mul(PrivatePresale).div(100)
        );
        _FanetyToken.transfer(
            address(DexesLiquidityTimelock),
            totalSupply.mul(DexesLiquidity).div(100)
        );
        _FanetyToken.transfer(
            address(CexesLiquidityTimelock),
            totalSupply.mul(CexesLiquidity).div(100)
        );
        _FanetyToken.transfer(
            address(MarketingAndCreatorsTimelock),
            totalSupply.mul(MarketingAndCreators).div(100)
        );
        _FanetyToken.transfer(
            address(PlatformDevelopmentTimelock),
            totalSupply.mul(PlatformDevelopment).div(100)
        );
        _FanetyToken.transfer(
            address(TeamAndEmployeesTimelock),
            totalSupply.mul(TeamAndEmployees).div(100)
        );
        _FanetyToken.transfer(
            address(AdvisorsTimelock),
            totalSupply.mul(Advisors).div(100)
        );
        _FanetyToken.transfer(
            address(LiquidityAndReservesTimelock),
            totalSupply.mul(LiquidityAndReserves).div(100)
        );
    }
}
