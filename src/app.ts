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
dotenv.config();

const app = express();

const App = http.createServer(app);

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5500"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(morgan("tiny"));
app.use(upload());

// Router
app.use(AuthRouter);
app.use(UserRoutes);
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ url: req.originalUrl + " not found" });
  next();
});

app.use(handleError);

export default App;
