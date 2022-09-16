import {getChecksumAddress} from 'starknet';
import type {RPC} from 'starknet/dist/types/api';
import {store} from './Redux';
import {StarsActions, type StarsState} from './Redux/Reducers/starsSlice';
import {provider} from './Utils/Starknet';

const INTERVAL_IN_SECONDS = Number(process.env.CRON_INTERVAL_IN_SECONDS) || 60;

type StarknetEvent = Omit<RPC.StarknetEmittedEvent, 'event'> & RPC.StarknetEvent;

const getEvents = async (
  keys: string[] = [],
  page = 0,
  allEvents: StarknetEvent[] = [],
): Promise<StarknetEvent[]> => {
  const response = await provider.getEvents({
    keys,
    toBlock: 'pending',
    address: process.env.CONTRACT_ADDRESS || '',
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

const getTransferEvents = async (): Promise<StarknetEvent[]> => {
  const events = await getEvents([
    '0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9',
  ]);

  return events
    .filter((event) => event.data[0] !== '0x0')
    .sort((a, b) => (a.block_number ?? Number.MAX_SAFE_INTEGER) - b.block_number);
};

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
  console.info(`CRON job started at ${new Date()}`);

  const mintEvents = await getMintEvents();

  const transferEvents = await getTransferEvents();

  const stars: StarsState = {};

  mintEvents.forEach((event) => {
    const id = parseInt(event.data[0], 16);
    const owner = event.data[2];

    // TODO: name
    const name = '\u0000\u0000';

    stars[id] = {
      id,
      name,
      owner: getChecksumAddress(owner),
    };
  });

  transferEvents.forEach((event) => {
    // 0 prev 1 new 2 id
    const prevOwner = event.data[0];
    const newOwner = event.data[1];
    const id = parseInt(event.data[2], 16);

    stars[id] = {
      ...stars[id],
      owner: getChecksumAddress(newOwner),
    };
  });

  store.dispatch(StarsActions.replaceStars(stars));

  console.info(`CRON job completed at ${new Date()}`);
};

// Run the CRON job when started
CRONJob();

// Run the CRON job every {INTERVAL_IN_SECONDS} seconds
setInterval(CRONJob, INTERVAL_IN_SECONDS * 1000);
