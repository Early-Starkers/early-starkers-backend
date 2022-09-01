import express from 'express';
import {store} from '../Redux';
import HTTPStatus from '../Utils/HTTPStatus';
import { addresses } from '../Utils/Addresses';

const Router = express.Router();

Router.get('/:address', async (req, res) => {
  const {address} = req.params;
  
  let result = false;
  for (const addr of addresses) {
    if (addr === address) {
        result = true;
    }
  }

  res.status(HTTPStatus.OK).send({result});
});

export default Router;
