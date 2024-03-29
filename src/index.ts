import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './router';

import './EventCRON';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', router);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.info(`Express server started listening on port ${PORT}`);
});
