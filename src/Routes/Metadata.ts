import express from 'express';
import {createReadStream} from 'fs';
import path from 'path';
import HTTPStatus from '../Utils/HTTPStatus';

const Router = express.Router();

Router.get('/:id', async (req, res) => {
  const {id} = req.params;
  const idInt = parseInt(id, 10) || 0;

  const MetadataPath = path.join(__dirname, '../', 'Metadata');
  const FilePath = path.join(MetadataPath, `${idInt}.json`);

  if (!idInt || idInt > 2468) {
    res.status(HTTPStatus.NotFound).send({message: 'Metadata not found'});
    return;
  }

  res.status(HTTPStatus.OK).setHeader('Content-Type', 'application/json');

  createReadStream(FilePath).pipe(res);
});

export default Router;
