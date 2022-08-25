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

Router.get('/:id', async (req, res) => {
  const {id} = req.params;
  const {stars} = store.getState();

  if (!id || !stars || !(id in stars)) {
    res.status(HTTPStatus.NotFound).send({message: 'Star not found'});
    return;
  }

  res.status(HTTPStatus.OK).send(stars[id]);
});

export default Router;
