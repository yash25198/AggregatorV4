const { expect } = require("chai");
const { ethers } = require("hardhat");
const ERC20ABI = require('./ERC20.json');
const readline = require("readline");

const axios = require('axios');

const main = async () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const SwapProxy = await ethers.getContractFactory("SwapProxy");
    const SP = await SwapProxy.deploy("0x1111111254fb6c44bAC0beD2854e76F90643097d");
    await SP.deployed();
    console.log("contract deployed to "+SP.address);
    const acc="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    //eth null token cuase it is a native coin
    let token_in = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    //dai token address
    let token_out = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    let amount = "10000000000";
    let slippage = "1";
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

// question user to enter name
          rl.question('are you sure?\n', name => {
            console.log(`Hey there ${name}!`);
          rl.close();
          });
          if(input=="y"){
            console.log("swapping...");
            SP.swap(min_res,tx,{'from':acc});
            console.log("swap successfull! :)");
          }
          else{
            console.log("not enough");
          }
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