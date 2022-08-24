import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './router';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', router);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`Express server started listening on port ${PORT}`);
});