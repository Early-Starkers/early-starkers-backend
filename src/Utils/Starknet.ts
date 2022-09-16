import {Contract, RpcProvider} from 'starknet';
import EarlystarkersABI from '../ABIs/EarlystarkersABI.json';

const {STARKNET_NODE_URL_1, CONTRACT_ADDRESS} = process.env;

export const provider = new RpcProvider({
  nodeUrl: STARKNET_NODE_URL_1 || 'https://alpha4.starknet.io',
});

export const contract = new Contract(EarlystarkersABI as never, CONTRACT_ADDRESS || '', provider);
