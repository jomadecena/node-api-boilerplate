let dotenv = ".env.development";

const env = process.env.NODE_ENV;

if (env === "production") {
  dotenv = ".env.production";
} else if (env === "staging") {
  dotenv = ".env.staging";
}

require("dotenv").config({ path: dotenv });

import express from 'express';
import session from 'express-session';
import cors from 'cors';

import { extractToken } from './utils/middleware';
import routes from './routes';
import { captureException } from './utils/logger';
import sequelize from './db';
import { exit } from 'process';
import { validateEnvVars } from './utils/common';

validateEnvVars();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs");
app.use(express.static("./public"));
//@ts-ignore
app.use(
  //@ts-ignore
  (req: Request, res: Response, next: NextFunction) => {
    next();
  },
  cors({ origin: "*" })
);
//@ts-ignore
app.use(extractToken);

routes(app);

const port = process.env.PORT || 3000;
sequelize.sync()
.then(() => {
  app.listen(port, async () => {
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

export default app;