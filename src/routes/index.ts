import { Application } from "express";
import { usersRouter } from "./users.routes";
import { groupsRouter } from "./groups.routes";
import { seedRouter } from "./seed.routes";

export const registerRoutes = (app: Application) => {
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/groups", groupsRouter);
  app.use("/api/v1/seed", seedRouter);
};
