import Web3 from 'web3';

// const web3 = new Web3(window.web3.currentProvider);
let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    //We are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
}
else {
    //We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/3df3446a077546a8aeba10bd83191704'
    );
    //creating an instance
    web3 = new Web3(provider);
}

export default web3;