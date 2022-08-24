import {Request} from 'express';

export type ReqBody<Req extends Record<PropertyKey, any>> = Request<
  Record<string, string>,
  any,
  Partial<Req>
>;
