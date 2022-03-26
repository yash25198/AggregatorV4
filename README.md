# 1inch Aggregator Protocol V4 Swap
The smart contract SwapProxy can be used to trade over 1Inch, using their latest Aggregator Protocol V4.
## Testing Environment 
The contract was tested on a mainnet fork using Alchemy API key
## Test Run Results
The test had hardcoded addresses which can be changed.

<img width="1264" alt="test results" src="https://user-images.githubusercontent.com/65656274/160258875-52aaadee-1a24-4717-a353-fb40fc70843e.png">

## Installations
```
git clone https://github.com/yash25198/1inch
npm init -y
npm install --save-dev hardhat
npm install web3
```
## Running Swap
- For swapping `default tokens`

  - Use the following command to start the local mainnet fork.
   
    ```
    npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/FGRXFwpdQxk6MNS2gGt1J7CputsW0EYo
    ```
  
  - Open a `new terminal window` for executing the next commands cause we dont want to mess up the terminal window that's keeping our local Ethereum network alive.
  
  - Run the following command to run `daiBalance.js` to initilize DAI balane in default accouts provided by HardHat( every account have 0 DAI initially ).
  
    ```
    npx hardhat run test/daiBalance.js --network localhost
    ```
  
  - Run the next command to swap DAI Tokens in the account to 1Inch Tokens via 1Inch's Aggregator Protocol.
  
    ```
    npx hardhat run test/sample-test.js --network localhost
    ```
  
  - Terminal will now contian the data from a GET query to 1Inch API and the best price and allowed slippage for the swap.
   
- For swapping `custom tokens`

  - Change addresses of ERC20 Tokens in `sample-test.js` under test folder.
  
  - Change Token address of required token in `daiBalance.js` under test folder
  
  - Change addresses of Tokens in `SwapProxy.sol` in contracts folders.

  - Follow the same steps mentioned for default run to get swap results.

## Notes

- The test `would not work on any test network` cause 1Inch has no test network contract or hosting.

- After swap check out the `terminal` where mainnet fork is running to see all the transactions made by the smart contract.

- All the transaction details and account balance are lost when the mainnet fork is `terminated`.


