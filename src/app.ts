import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { registerRoutes } from "./routes";

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);
  registerRoutes(app);

  app.use(errorMiddleware);

  return app;
};
