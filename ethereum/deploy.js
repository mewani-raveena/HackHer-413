const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/ForumFactory');

const provider = new HDWalletProvider(
    //give access to account mnemonic
    // provide your metamask account mnemonic
    //link to RinkeBy network
    // provide link to your infura network
);
const web3 = new Web3(provider);

const deploy = async () => {
    //get all the accounts
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({
            data: '0x' + compiledFactory.bytecode,
            arguments: []
        })
        .send({
            from: accounts[0]
        });

    // console.log(compiledFactory.interface);
    console.log('Contract deployed to', result.options.address);
};
deploy();
