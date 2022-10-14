import express, { NextFunction, Request, Response } from "express";
import * as http from "http";
import upload from "express-fileupload";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import AuthRouter from "./routes/auth.routes";
import handleError from "./middlewares/error-handler.middleware";
import UserRoutes from "./routes/user.routes";
import AdminRoutes from "./routes/admin.routes";
dotenv.config();

const app = express();

const App = http.createServer(app);

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "//onlineseacoastacct.net",
    "//www.onlineseacoastacct.net",
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(morgan("tiny"));
app.use(upload());

const APPKEY = process.env.APPKEY as string;
app.use(function (req: Request, res: Response, next: NextFunction) {
  const appkey = req.headers["x-app-key"];
  const origin = req.headers["origin"];

  if ((appkey && appkey === APPKEY) || origin === "http://localhost:5173") {
    return next();
  }
  return res.sendStatus(403);
});
// Router
app.use(AuthRouter);
app.use(UserRoutes);
app.use("/admin", AdminRoutes);
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ url: req.originalUrl + " not found" });
  next();
});

app.use(handleError);

export default App;
