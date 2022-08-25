import express from 'express';
import {store} from '../Redux';
import HTTPStatus from '../Utils/HTTPStatus';

const Router = express.Router();

Router.get('/', async (req, res) => {
  const {stars} = store.getState();

  if (!stars || Object.keys(stars).length === 0) {
    res.status(HTTPStatus.NoContent).send([]);
    return;
  }

  res.status(HTTPStatus.OK).send(Object.values(stars));
});

export default Router;
