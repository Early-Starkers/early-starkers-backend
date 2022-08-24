import express from 'express';

import Stars from './Routes/Stars';

const Router = express.Router();

Router.use('/stars', Stars);

export default Router;
