var Migrations = artifacts.require("./Trabic.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations,'Trabic','TRC',18);




};