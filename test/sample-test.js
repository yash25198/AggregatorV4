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
    const SP = await SwapProxy.deploy("0x11111112542D85B3EF69AE05771c2dCCff4fAa26");
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
      const response = await axios.get(`https://api.1inch.exchange/v3.0/${chain_id}/quote?fromTokenAddress=${token_in}&toTokenAddress=${token_out}&amount=${amount}`);
      if(response.data){

          data = response.data;
        console.log("quote Successfull! :)");
        console.log(data);
        let min_res = parseInt(data.toTokenAmount) * (100-slippage)/100;
        console.log("min_res: "+min_res);
        
          let balance = await ethers.provider.getBalance(acc);
          console.log("balance: "+balance);
          let input = "";

// question user to enter name
          rl.question('are you sure?\n', name => {
            console.log(`Hey there ${name}!`);
          rl.close();
          });
          if(input=="y"){
            console.log("swapping...");

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