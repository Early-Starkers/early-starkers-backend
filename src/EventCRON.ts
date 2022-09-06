import {store} from './Redux';
import {StarsActions, type StarsState} from './Redux/Reducers/starsSlice';
import {sleep} from './Utils/Helpers';
import {getAllStarsInfo, provider1 as provider, contract1 as contract} from './Utils/Starknet';

const INTERVAL_IN_SECONDS = Number(process.env.CRON_INTERVAL_IN_SECONDS) || 60;

let lastBlockNumber = 0;

const CRONJob = async (): Promise<void> => {
  const blockNumber = await provider.getBlockNumber();

  console.log(blockNumber);

  if (blockNumber > lastBlockNumber) {
    console.info(`CRON job found new block ${blockNumber} at ${new Date()}`);

    const events = await provider.getEvents({
      toBlock: 'latest',
      address: contract.address,
      page_size: 200,
      page_number: 0,
    } as any);

    console.log(JSON.stringify(events, null, 2));

    lastBlockNumber = blockNumber;
  }

  console.info(`CRON job completed at ${new Date()}`);
};

CRONJob();
