import { Express, Request, Response } from 'express';
import userRoutes from "./user";
const routes = (app: Express) => {
  app.get("/api/health", (req: Request, res: Response) => {
    res.send(200);
  })
  app.use("/api/user", userRoutes);
}

export default routes;