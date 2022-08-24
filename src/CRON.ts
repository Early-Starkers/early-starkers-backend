import {store} from './Redux';
import {StarsActions, StarsState} from './Redux/Reducers/starsSlice';
import {getAllStarsInfo} from './Utils/Starknet';

const INTERVAL_IN_SECONDS = Number(process.env.CRON_INTERVAL_IN_SECONDS) || 60;

setInterval(async () => {
  const stars = await getAllStarsInfo();

  const mappedStars: StarsState = {};
  stars.forEach((star) => {
    mappedStars[star.id] = star;
  });

  store.dispatch(StarsActions.replaceStars(mappedStars));
}, INTERVAL_IN_SECONDS * 1000);
