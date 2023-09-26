const HDWalletProvider = require('@truffle/hdwallet-provider');
const {Web3} = require('web3');
const compiledFactory = require('./compile');
require('dotenv').config();
const {MNEMONIC, INFURA_API_KEY} = process.env;

const provider = new HDWalletProvider(
    {
        mnemonic: {
            phrase: MNEMONIC
        },
        providerOrUrl: INFURA_API_KEY
    }
)

//console.log('0x' + compiledFactory.bytecode);

const web3 = new Web3 (provider);

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Attempting to deploy contract from account:", accounts[0]);
        
        const result = await new web3.eth.Contract(compiledFactory.abi)
            .deploy({ data: compiledFactory.evm.bytecode.object })
            .send({ from: accounts[0], gas: '4465030' });

        console.log("Contract deployed to", result.options.address);
    } catch (error) {
        console.error("An error occurred during the deployment", error);
    }
}

deploy();