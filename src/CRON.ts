import {store} from './Redux';
import {StarsActions, type StarsState} from './Redux/Reducers/starsSlice';
import {getAllStarsInfo} from './Utils/Starknet';

const INTERVAL_IN_SECONDS = Number(process.env.CRON_INTERVAL_IN_SECONDS) || 60;

let failedPreviousRun = false;

const CRONJob = async (): Promise<void> => {
  console.info(`CRON job started at ${new Date()}`);

  try {
    const stars = await getAllStarsInfo();

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

    console.warn('CRON job failed, trying again in 10 seconds');

    // retry after 10 seconds
    await new Promise((resolve) => {
      setTimeout(resolve, 10 * 1000);
    });

    await CRONJob();
  }

  console.info(`CRON job completed at ${new Date()}`);
};

// Run the CRON job when started
CRONJob();

// Run the CRON job every {INTERVAL_IN_SECONDS} seconds
setInterval(CRONJob, INTERVAL_IN_SECONDS * 1000);
