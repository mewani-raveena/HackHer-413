import web3 from './web3';
import ForumFactory from './build/ForumFactory';

const instance = new web3.eth.Contract(
    JSON.parse(ForumFactory.interface),
    '0x76d218F793C80Bb8C3ccd4CC0b8A19240b4f2De5'
);

export default instance;