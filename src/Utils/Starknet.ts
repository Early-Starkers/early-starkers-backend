import {Contract, number, RpcProvider, getChecksumAddress} from 'starknet';
import BN from 'bn.js';
import EarlystarkersABI from '../ABIs/EarlystarkersABI.json';
import {HexToAscii, sleep} from './Helpers';

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

type GetAllStarsInfoReturnType = Awaited<ReturnType<typeof getStarInfo>> & {id: number};

export const getAllStarsInfo = async (): Promise<GetAllStarsInfoReturnType[]> => {
  const lastId = (await getLastId()) - 1;

  const results = await Promise.allSettled(
    Array(lastId)
      .fill('')
      .map(async (_, index) => {
        const {name, owner} = await getStarInfo(index + 1);

        return {
          name,
          owner: getChecksumAddress(owner),
          id: index + 1,
        };
      }),
  );

  if (results.some(({status}) => status === 'rejected')) {
    console.warn('Some stars failed to be fetched, retrying those stars in 15 seconds');

    // If some failed to get, wait for 15 seconds and retry those that failed
    await sleep(15);

    return Promise.all(
      results.map(async (result, index) => {
        if (result.status === 'rejected') {
          const {name, owner} = await getStarInfo(index);

          return {
            name,
            owner: getChecksumAddress(owner),
            id: index + 1,
          };
        }

        return result.value;
      }),
    );
  }

  return results as unknown as GetAllStarsInfoReturnType[];
};
