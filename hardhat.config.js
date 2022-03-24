require("@nomiclabs/hardhat-waffle");
//require("@nomiclabs/hardhat-etherscan");


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/m52T7GNgQknMpoGgSxeWStPgL1WZhJQH`,
      accounts: ["cda4b59f36fbc58e90f4260d1dc4de7de9f8b86ba661c34c347e029a5af6a939"],
    },
  },
};
