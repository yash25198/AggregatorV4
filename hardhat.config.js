require("@nomiclabs/hardhat-waffle");
//require("@nomiclabs/hardhat-etherscan");


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/FGRXFwpdQxk6MNS2gGt1J7CputsW0EYo`,
      //accounts: ["cda4b59f36fbc58e90f4260d1dc4de7de9f8b86ba661c34c347e029a5af6a939"],
    },
  },
};
