import express from "express";
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { registerRoutes } from "./routes";
import { swaggerSpec } from "./config/swagger";

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  registerRoutes(app);

  app.use(errorMiddleware);

  return app;
};
