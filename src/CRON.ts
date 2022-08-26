import {store} from './Redux';
import {StarsActions, type StarsState} from './Redux/Reducers/starsSlice';
import {getAllStarsInfo} from './Utils/Starknet';

const INTERVAL_IN_SECONDS = Number(process.env.CRON_INTERVAL_IN_SECONDS) || 60;

let failedPreviousRun = false;

const CRONJob = async (): Promise<void> => {
  try {
    const stars = await getAllStarsInfo();

    const mappedStars: StarsState = {};
    stars.forEach((star) => {
      mappedStars[star.id] = star;
    });

    store.dispatch(StarsActions.replaceStars(mappedStars));
  } catch (_) {
    // If failed again, don't try again for a while
    if (failedPreviousRun) return;

    failedPreviousRun = true;

    // retry after 10 seconds
    await new Promise((resolve) => {
      setTimeout(resolve, 10 * 1000);
    });

    await CRONJob();
  }
};

// Run the CRON job when started
CRONJob();

// Run the CRON job every {INTERVAL_IN_SECONDS} seconds
setInterval(CRONJob, INTERVAL_IN_SECONDS * 1000);
