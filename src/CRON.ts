import {store} from './Redux';
import {StarsActions, type StarsState} from './Redux/Reducers/starsSlice';
import {getAllStarsInfo} from './Utils/Starknet';

const INTERVAL_IN_SECONDS = Number(process.env.CRON_INTERVAL_IN_SECONDS) || 60;

const CRONJob = async (): Promise<void> => {
  const stars = await getAllStarsInfo();

  const mappedStars: StarsState = {};
  stars.forEach((star) => {
    mappedStars[star.id] = star;
  });

  store.dispatch(StarsActions.replaceStars(mappedStars));
};

// Run the CRON job when started
CRONJob();

// Run the CRON job every {INTERVAL_IN_SECONDS} seconds
setInterval(CRONJob, INTERVAL_IN_SECONDS * 1000);
