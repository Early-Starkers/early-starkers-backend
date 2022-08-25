import {Contract, number, RpcProvider} from 'starknet';
import BN from 'bn.js';
import EarlystarkersABI from '../ABIs/EarlystarkersABI.json';
import {HexToAscii} from './Helpers';

const {STARKNET_NODE_URL, CONTRACT_ADDRESS} = process.env;

export const provider = new RpcProvider({
  nodeUrl: STARKNET_NODE_URL || 'https://alpha4.starknet.io',
});

export const contract = new Contract(EarlystarkersABI as never, CONTRACT_ADDRESS || '', provider);

export const getName = async (tokenId: number): Promise<string> => {
  const name: BN = await contract.name_of([tokenId, '0']);
  const bn = number.toBN(name.toString());
  const hex = number.toHex(bn);

  return HexToAscii(hex);
};

export const getOwner = async (tokenId: number): Promise<string> => {
  const owner = await contract.ownerOf([tokenId, '0']);
  const bn = number.toBN(owner.toString());

  return number.toHex(bn);
};

export const getStarInfo = async (tokenId: number): Promise<{name: string; owner: string}> => {
  const [name, owner] = await Promise.all([getName(tokenId), getOwner(tokenId)]);

  return {name, owner};
};

export const getLastId = async (): Promise<number> => {
  const lastId = await contract.get_last_id();

  return parseInt(lastId.toString(), 10);
};

export const getAllStarsInfo = async (): Promise<
  (Awaited<ReturnType<typeof getStarInfo>> & {id: number})[]
> => {
  const lastId = await getLastId();

  return Promise.all(
    Array(lastId)
      .fill('')
      .map(async (_, index) => ({
        ...(await getStarInfo(index + 1)),
        id: index + 1,
      })),
  );
};
