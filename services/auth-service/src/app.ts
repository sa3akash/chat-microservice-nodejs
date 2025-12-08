import { globalErrorHandler } from "@chat/common";
import express, { type Application } from "express";

export const createApp = (): Application => {
  const app = express();

  app.use(globalErrorHandler);
  return app;
};
