import {Contract, defaultProvider, RpcProvider} from 'starknet';
import EarlystarkersABI from '../ABIs/EarlystarkersAbi.json';

const {STARKNET_NODE_URL, CONTRACT_ADDRESS} = process.env;

export const provider = new RpcProvider({
  nodeUrl: STARKNET_NODE_URL || 'https://alpha4.starknet.io',
});

export const contract = new Contract(
  EarlystarkersABI as any,
  CONTRACT_ADDRESS || '',
  defaultProvider,
);
