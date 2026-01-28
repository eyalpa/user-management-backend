import { createApp } from "./app";
import { connectDb } from "./config/db";
import { loadEnv } from "./config/env";

const start = async () => {
  loadEnv();
  await connectDb();

  const app = createApp();
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${port}`);
  });
};

void start();
