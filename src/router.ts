import express from 'express';

import Stars from './Routes/Stars';
import Metadata from './Routes/Metadata';
import Wl from "./Routes/Wl";

const Router = express.Router();

Router.use('/stars', Stars);
Router.use('/', Metadata);
Router.use('/wl', Wl);

export default Router;
