const contract = require('truffle-contract');
const Web3 = require('web3');
const trabic_artifact = require('../build/contracts/Trabic.json');

const metacoin_artifact = require('../build/contracts/MetaCoin.json');

const web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
var MetaCoin = contract(metacoin_artifact);
var TrabicCoin=contract(trabic_artifact)

module.exports = {
  tokenName:async function(){
    let token;
    var self =this;
   await TrabicCoin.setProvider(self.web3.currentProvider)
   
   token=await TrabicCoin.deployed();
   const testName=await token.symbol();
  // console.log('this the provider test')
 // console.log("hammad zahid");
  
return testName;
},
  
  start: function(callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

     callback(self.accounts);
    });
  },
  refreshBalance: function(account, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },
  sendCoin: function(amount, sender, receiver, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: sender});
    }).then(function() {
      self.refreshBalance(sender, function (answer) {
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  }
}
