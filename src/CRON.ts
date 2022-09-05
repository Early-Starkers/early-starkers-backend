import {store} from './Redux';
import {StarsActions, type StarsState} from './Redux/Reducers/starsSlice';
import {sleep} from './Utils/Helpers';
import {getAllStarsInfo, getLastId} from './Utils/Starknet';

const INTERVAL_IN_SECONDS = Number(process.env.CRON_INTERVAL_IN_SECONDS) || 600;

let cronJobRunning = false;
let failedPreviousRun = false;

const CRONJob = async (): Promise<void> => {
  console.info(`CRON job started at ${new Date()}`);

  cronJobRunning = true;

  try {
    const lastId = await getLastId();

    const stars = await getAllStarsInfo(lastId);

    failedPreviousRun = false;

    const mappedStars: StarsState = {};
    stars.forEach((star) => {
      mappedStars[star.id] = star;
    });

    store.dispatch(StarsActions.replaceStars(mappedStars));
  } catch (_) {
    // If failed again, don't try again for a while
    if (failedPreviousRun) {
      console.warn('CRON job failed again, not trying again for a while');

      failedPreviousRun = false;
      return;
    }

    failedPreviousRun = true;

    console.warn('CRON job failed, retrying the job again in 60 seconds');

    // retry after 60 seconds
    await sleep(60);

    await CRONJob();
  }

  cronJobRunning = false;

  console.info(`CRON job completed at ${new Date()}`);
};

const CRONNewStars = async (): Promise<void> => {
  if (cronJobRunning) return;

  console.info(`Looking for new stars job started at ${new Date()}`);

  try {
    const lastId = await getLastId();

    const storeStars = Object.keys(store.getState().stars);
    const newestId = parseInt(storeStars[storeStars.length - 1], 10);

    const stars = await getAllStarsInfo(lastId, newestId);

    const mappedStars: StarsState = {};
    stars.forEach((star) => {
      mappedStars[star.id] = star;
    });

    store.dispatch(StarsActions.updateStars(mappedStars));
  } catch (_) {
    console.info(`Looking for new stars job failed, not trying again for a while`);
  }

  console.info(`Looking for new stars job completed at ${new Date()}`);
};

// Run the CRON job when started
CRONJob();

// Run the CRON job every {INTERVAL_IN_SECONDS} seconds
setInterval(CRONJob, INTERVAL_IN_SECONDS * 1000);
setInterval(CRONNewStars, (INTERVAL_IN_SECONDS / 4) * 1000);
