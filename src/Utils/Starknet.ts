import {RpcProvider} from 'starknet';

const {STARKNET_NODE_URL} = process.env;

export const provider = new RpcProvider({
  nodeUrl: STARKNET_NODE_URL || 'https://alpha4.starknet.io',
});
