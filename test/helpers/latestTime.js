// const web3 = require('web3');

 async function latestTime () {
  console.log("its calling");
  // console.log("latest time"+await web3.eth.getBlock('latest').timestamp);
    return await web3.eth.getBlock('latest').timestamp;
  }

  module.exports = latestTime;