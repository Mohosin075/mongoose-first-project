import { Server } from 'http';
import config from './app/config';
import mongoose from 'mongoose';
import seedSuperAdmin from './DB';
import app from './app';
// getting-started.js

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`unHandleRejection detected, shutting down`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});

process.on('uncaughtException', () => {
  console.log(`uncaughtException detected, shutting down`);
  process.exit(1);
});
