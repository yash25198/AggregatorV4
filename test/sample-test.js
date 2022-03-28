
const Web3 = require('web3')
const { expect } = require("chai");
const { ethers } = require("hardhat");
const ERC20ABI = require('./ERC20.json');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const fromToken = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const daiToken = new web3.eth.Contract(ERC20ABI, fromToken);

const axios = require('axios');

const main = async () => {
    let sleep = ms => {  
      return new Promise(resolve => setTimeout(resolve, ms));  
    }; 
    async function waitTransaction(txHash) {
    let tx = null;
    while (tx == null) {
        tx = await web3.eth.getTransactionReceipt(txHash);
        
    }
    console.log("Transaction " + txHash + " was mined.");
    return (tx.status);
    }
    async function approveToken(receiver, amount1) {
      daiToken.methods.approve(receiver, amount1).send({ from: acc }, async function(error, txHash) {
          if (error) {
              console.log("ERC20 could not be approved", error);
              return;
          }
          console.log("ERC20 token approved to " + receiver);
          const status = await waitTransaction(txHash);
          if (!status) {
              console.log("Approval transaction failed.");
          }
         
      })
  }
    
    const SwapProxy = await ethers.getContractFactory("SwapProxy");
    const SP = await SwapProxy.deploy("0x1111111254fb6c44bAC0beD2854e76F90643097d","0x6B175474E89094C44Da98b954EedeAC495271d0F","0x111111111117dC0aa78b770fA6A738034120C302");
    await SP.deployed();
    console.log("contract deployed to "+SP.address);
    const acc="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    //eth null token cuase it is a native coin
    let token_in = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    //dai token address
    let token_out = "0x111111111117dC0aa78b770fA6A738034120C302";
    let amount = "1000";
    let slippage = "10";
    let chain_id = "1";
    try{
      //using quote not swap to find slipage and then swap
      const response = await axios.get(`https://api.1inch.exchange/v4.0/${chain_id}/swap?fromTokenAddress=${token_in}&toTokenAddress=${token_out}&amount=${amount}&fromAddress=${SP.address}&slippage=${slippage}&destReceiver=${acc}&disableEstimate=true`);
      if(response.data){
        
          data = response.data;
         
        let tx=data.tx.data;
        console.log("quote Successfull! :)");
        console.log(data);
        let min_res = parseInt(data.toTokenAmount) * (100-slippage)/100;
        console.log("min_res: "+min_res);
        
          let balance = await ethers.provider.getBalance(acc);
          console.log("balance: "+balance);
          let input = "y";


          console.log( "DAI before Swap :"+await SP.getDaiBalance());
          console.log( "1Inch before Swap :"+await SP.get1InchBalance());
          if(input=="y"){

            await approveToken(SP.address, amount);
            await sleep(4000);
            console.log("swapping...");
            await SP.swap(parseInt(min_res),tx,{'from':acc});
            //tm = await Web3.eth.sendTransaction(data.tx.data)
            console.log("swap successfull! :)");
          }
          else{
            console.log("not enough");
          }
          console.log( "DAI after Swap :"+await SP.getDaiBalance());
          console.log( "1Inch after Swap :"+await SP.get1InchBalance());
      }
    }catch(err){
      console.log("swapper encountered an error below")
      console.log(err)
    }
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();