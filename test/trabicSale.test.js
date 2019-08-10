
const { balance, expectEvent } = require('openzeppelin-test-helpers');
var ether = require('./helpers/ehers.js');
var { AssertionError } = require('assert');
const BigNumber = web3.BigNumber;
var  EVMRevert = require('./helpers/EVMRevert');
var { increaseTimeTo, duration } = require('./helpers/increaseTime');
var latestTime = require('./helpers/latestTime');
const Trabic  = artifacts.require('Trabic')
const trabicSale = artifacts.require('trabicCrowdSale')
const Web3 = require('web3')

 require('chai')
.use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('this is the trabic Crowdsale ',function([_,wallet,invester1,invester2],value,rate){
    //const expectedTokenAmount = rate.mul(value);
    beforeEach(async function(){
        this.name='Trabic';
        this.symbol='TRC';
        this.decimals=18;
        this.trabicToken=await Trabic.new(this.name,this.symbol,this.decimals);
        const wei=1000000000000000000;
        this.cap=10*wei;
        this.rate=500;
        console.log("LAtest Time :"+latestTime());
        // console.log("Time Now is : "+new Date().getTime());
        // console.log("Caped  is  "+this.cap)
        
        this.openingTime = new Date().getTime()  - duration.weeks(100);//latestTime() + duration.weeks(1);
         this.closingTime = this.openingTime + duration.weeks(101);
        console.log("Closing Time is :"+this.closingTime );
     
        this.investorMinCap = ether(0.002);
        this.inestorHardCap = ether(50);
        this.wallet=wallet; 
        this.trabicCrowdSale=await trabicSale.new(500,this.wallet,this.trabicToken.address,this.cap.toString(),this.openingTime,this.closingTime)

        await this.trabicToken.transferOwnership(this.trabicCrowdSale.address)
        await this.trabicToken.addMinter(this.trabicCrowdSale.address)
       // addMinter(address account) 

    });
    it('track the trabic token',async function(){
        const tokenTrack=await this.trabicCrowdSale.token();
        tokenTrack.should.be.equal(this.trabicToken.address);
    })
    it('this is tracking of wallet address',async function(){
        const wallletAddress=await this.trabicCrowdSale.wallet();
        wallletAddress.should.equal(this.wallet)
    })

   describe('this is testing weather rate is correct',function(){

    it('this is tracking of rate ',async function(){
        //const value =ether(1);
        const wallletAddress=await this.trabicCrowdSale.rate();
        //wallletAddress.should.be.bignumber.equal(value)
        assert.equal(wallletAddress,this.rate,'both rate are equals') 
    })

   })


   describe('this should describe about the minted Crowdsale',function(){
    it('this is the cap test',async function(){
        const value=ether(1);
     const currentSupply=await this.trabicToken.totalSupply();
     await this.trabicCrowdSale.sendTransaction({value:value,from:invester1}).should.be.fulfilled;
     //capValue.should.be.bignumber.equal(this.cap);
     const newSupply=await this.trabicToken.totalSupply();
     assert.isTrue(newSupply>currentSupply)
    })
})



    describe('this this test of accepting payments',function(){
        it('this is the issue of accepting payments',async function(){
            const value =ether(1);
           // const purchaser=invester2;
           //await this.trabicToken.transferOwnership(this.trabicCrowdSale.address)
            //await this.trabicCrowdSale.send(4*1000000000000000000) 
           //await this.trabicCrowdSale.buyToken(invester1,{value:value,from:purchaser}).should.be.fulfilled;
           const purchaser=invester2;
          // const value =1*wei;

                await this.trabicCrowdSale.sendTransaction({value:value,from:invester2}).should.be.fulfilled
                await this.trabicCrowdSale.buyTokens(invester1,{value:value,from:purchaser}).should.be.fulfilled;

                var openingTime = this.trabicCrowdSale.openingTime();
                var closingTime = this.trabicCrowdSale.closingTime();

        })
    })
    describe('this should tell is the cap value',function(){


        it('this is Block Time Stemp Check',async function(){
            const capValue=await this.trabicCrowdSale.blockTimeStamp();
           // capValue.should.be.bignumber.equal(this.cap);
           console.log("Block Time Stamp is "+capValue);
            // assert.isTrue(capValue==this.cap)
           })
        it('this is the cap test',async function(){
         const capValue=await this.trabicCrowdSale.cap();
        // capValue.should.be.bignumber.equal(this.cap);
         assert.isTrue(capValue==this.cap)
        })
    })
    describe('this should describe about maximum capping',function(){
        it('this test will tell about capping ',async function(){
          const  purchaser=invester2;
          const  value1=ether(0.2);
            await this.trabicCrowdSale.buyTokens(invester1,{value:value1,from:purchaser}).should.be.fulfilled;
          const  value2 =ether(1);
            await this.trabicCrowdSale.buyTokens(invester1,{value:value2,from:purchaser}).should.be.fulfilled;

        })
    })
   
    describe('this should be given about the basic range ',function(){
        it('this should return either range is correct or not ',async function(){
          const  purchaser=invester2;
          const  value1=ether(1);
            await this.trabicCrowdSale.buyTokens(invester2,{value:value1,from:purchaser}).should.be.fulfilled;
            const range=await this.trabicCrowdSale.getUserContribution(invester2);
            //assert.equal(range,value1,'this the thing which will never be os')

        })
    })
    describe('Timed crowdsale  ',function(){
        it('crowd sale has now closed yet ',async function(){
          const  purchaser=invester2;
          const  value1=ether(1);
           const timeClosed= await this.trabicCrowdSale.hasClosed();
            //const range=await this.trabicCrowdSale.getUserContribution(invester2);
            //assert.equal(range,value1,'this the thing which will never be os')
            timeClosed.should.be.false;
        })
    })


   







})