import express from 'express';

import Stars from './Routes/Stars';
import Metadata from './Routes/Metadata';

const Router = express.Router();

Router.use('/stars', Stars);
Router.use('/metadata', Metadata);

export default Router;
