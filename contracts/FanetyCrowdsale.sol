// SPDX-License-Identifier: MIT
pragma solidity 0.5.5;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/TokenTimelock.sol";
import "hardhat/console.sol";

contract FanetyCrowdsale is Crowdsale {
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
        // console.log(token.address);
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

        // DISTRIBUTE TOKENS VIA TOKENOMICS
        distributeAndLockTokens();
    }

    /**
     * will be called by owner when crowdsale has been completed, to transfer the tokens
     */
    function distributeAndLockTokens() public  {
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

        uint256 balance = _FanetyToken.balanceOf(msg.sender);
        console.log(address(this));

        // transfer tokens to vault till release time
        _FanetyToken.approve(address(this), totalSupply.mul(PrivatePresale).div(100));
        _FanetyToken.transferFrom(
            msg.sender,
            address(PrivatePresaleTimelock),
            totalSupply.mul(PrivatePresale).div(100)
        );
        _FanetyToken.transfer(
            address(DexesLiquidityTimelock),
            totalSupply.mul(PrivatePresale).div(100)
        );
        _FanetyToken.transfer(
            address(CexesLiquidityTimelock),
            totalSupply.mul(PrivatePresale).div(100)
        );
        _FanetyToken.transfer(
            address(MarketingAndCreatorsTimelock),
            totalSupply.mul(PrivatePresale).div(100)
        );
        _FanetyToken.transfer(
            address(PlatformDevelopmentTimelock),
            totalSupply.mul(PrivatePresale).div(100)
        );
        _FanetyToken.transfer(
            address(TeamAndEmployeesTimelock),
            totalSupply.mul(PrivatePresale).div(100)
        );
        _FanetyToken.transfer(
            address(AdvisorsTimelock),
            totalSupply.mul(PrivatePresale).div(100)
        );
        _FanetyToken.transfer(
            address(LiquidityAndReservesTimelock),
            totalSupply.mul(PrivatePresale).div(100)
        );
    }
}
