import {getChecksumAddress} from 'starknet';
import type {RPC} from 'starknet/dist/types/api';
import {store} from './Redux';
import {StarsActions, type StarsState} from './Redux/Reducers/starsSlice';
import {sleep} from './Utils/Helpers';
import {
  getAllStarsInfo,
  getLastId,
  provider1 as provider,
  contract1 as contract,
} from './Utils/Starknet';

const INTERVAL_IN_SECONDS = Number(process.env.CRON_INTERVAL_IN_SECONDS) || 60;

type StarknetEvent = Omit<RPC.StarknetEmittedEvent, 'event'> & RPC.StarknetEvent;

let lastBlockNumber = 0;

const getEvents = async (
  keys: string[] = [],
  page = 0,
  allEvents: StarknetEvent[] = [],
): Promise<StarknetEvent[]> => {
  const response = await provider.getEvents({
    toBlock: 'pending',
    address: contract.address,
    keys: ['0x1d7849c0f6c42b67ef46bfe871686aeac2aa524ff4c77793f2afbd412acbd54'],
    page_size: 1000,
    page_number: page,
  } as any);

  if (!response.is_last_page) {
    return getEvents(keys, page + 1, [
      ...allEvents,
      ...(response.events as unknown as StarknetEvent[]),
    ]);
  }

  return [...allEvents, ...(response.events as unknown as StarknetEvent[])];
};

// 99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9

const getMintEvents = async (): Promise<StarknetEvent[]> => {
  const events = await getEvents([
    '0x1d7849c0f6c42b67ef46bfe871686aeac2aa524ff4c77793f2afbd412acbd54',
  ]);

  return events.sort(
    (a, b) =>
      (a.block_number ?? Number.MAX_SAFE_INTEGER) - b.block_number ||
      parseInt(a.data[0], 16) - parseInt(b.data[0], 16),
  );
};

const CRONJob = async (): Promise<void> => {
  const blockNumber = await provider.getBlockNumber();

  const fromBlock = lastBlockNumber;
  lastBlockNumber = blockNumber;

  if (blockNumber > fromBlock) {
    console.info(`CRON job found new block ${blockNumber} at ${new Date()}`);

    const mintEvents = await getMintEvents();

    const stars: StarsState = {};

    mintEvents.forEach((event) => {
      const id = event.data[0];
      const owner = event.data[1];

      // TODO: name
      const name = '\u0000\u0000';

      stars[id] = {
        id: parseInt(id, 16),
        name,
        owner: getChecksumAddress(owner),
      };
    });

    store.dispatch(StarsActions.replaceStars(stars));
  }

  console.info(`CRON job completed at ${new Date()}`);
};

CRONJob();
