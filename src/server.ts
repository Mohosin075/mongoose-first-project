import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
// getting-started.js

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    console.log('dbll', config.database_url);

    app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
