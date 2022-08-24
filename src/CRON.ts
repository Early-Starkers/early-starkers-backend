import {provider} from './Utils/Starknet';

const INTERVAL_IN_SECONDS = Number(process.env.CRON_INTERVAL_IN_SECONDS) || 60;

let lastBlockNumber = 0;

setInterval(async () => {
  const blockNumber = await provider.getBlockNumber();

  if (blockNumber > lastBlockNumber) {
    // validate and process new block
    lastBlockNumber = blockNumber;
  }
}, INTERVAL_IN_SECONDS * 1000);
