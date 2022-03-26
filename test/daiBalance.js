const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const DAI_SLOT = 2;
const Web3 = require('web3')
const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers;
const network = hre.network;
const ERC20ABI = require('./ERC20.json');
const BN = require('bn.js')



const main = async () => {
    const toBytes32 = (bn) => {
        return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
      };
      
    const setStorageAt = async (address, index, value) => {
        await ethers.provider.send("hardhat_setStorageAt", [address, index, value]);
        await ethers.provider.send("evm_mine", []); // Just mines to the next block
    };
    //await hre.run("compile");
    const Dai = new ethers.Contract(DAI_ADDRESS, ERC20ABI, ethers.provider);
    const locallyManipulatedBalance = "100000000000000000000";

    const [user] = await ethers.getSigners();
    const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    // to get storage slots for a token address
    const index = ethers.utils.solidityKeccak256(
      ["uint256", "uint256"],
      [userAddress, DAI_SLOT] // key, slot
    );

     await setStorageAt(
       DAI_ADDRESS,
       index.toString(),
       toBytes32(ethers.BigNumber.from(locallyManipulatedBalance)).toString()
     );
    //await network.provider.send('hardhat_setStorageAt', [DAI_ADDRESS, index.toString(), toBytes32(locallyManipulatedBalance).toString()]);
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