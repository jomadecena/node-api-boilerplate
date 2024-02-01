
import { captureException } from './utils/logger';
import sequelize from './db';
import { exit } from 'process';
import app from './app';

const port = process.env.PORT || 3000;
sequelize.sync()
.then(() => {
  app.listen(port, () => {
    try {
      console.log(`[${process.env.NODE_ENV}] environment server running at port ${port}.`);
    } catch (ex) {
      captureException(ex, "Unable to run app");
    }
  });
})
.catch((ex) => {
  captureException(ex, "Unable to synchronize database.");
  exit(1);
});