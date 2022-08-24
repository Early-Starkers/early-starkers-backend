import express from 'express';
import HTTPStatus from '../Utils/HTTPStatus';

const Router = express.Router();

Router.get('/', async (req, res) => {
  res.status(HTTPStatus.OK).send('Hello World!');
});

export default Router;
