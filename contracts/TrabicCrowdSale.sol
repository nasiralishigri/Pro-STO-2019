pragma solidity ^0.5.0;
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
//import "../node_modules/openzeppelin-solidity/contracts/access/roles/MinterRole.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
//import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract trabicCrowdSale is Crowdsale,MintedCrowdsale,CappedCrowdsale,TimedCrowdsale{
    uint256 public investorMinCap = 2000000000000000; // 0.002 ether
  uint256 public investorHardCap = 50000000000000000000;// 2 ether
  mapping(address => uint256) public contributions;
  constructor(uint256 _rate,address payable _wallet,ERC20 _token,uint _cap,uint256 _openingTime,uint256 _closingTime)
  Crowdsale(_rate,_wallet,_token)CappedCrowdsale(_cap)TimedCrowdsale(_openingTime,_closingTime) public{
         
}
 function getUserContribution(address _beneficiary)
    public view returns (uint256)
  {
    return contributions[_beneficiary];
  }
function _preValidatePurchase1(
    address _beneficiary,
    uint256 _weiAmount
  )
    internal
  {
    super._preValidatePurchase(_beneficiary, _weiAmount);
    uint256 _existingContribution = contributions[_beneficiary];
    uint256 _newContribution = _existingContribution.add(_weiAmount);
    require(_newContribution >= investorMinCap && _newContribution <= investorHardCap,'this transection ok now  because it is in between range');
    contributions[_beneficiary] = _newContribution;
  }

}
