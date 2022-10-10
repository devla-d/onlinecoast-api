import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { AuthMiddleWare } from "../middlewares/auth.middleware";

const UserRoutes = Router();
const userController = new UserController();
const { authRequired } = new AuthMiddleWare();

UserRoutes.get("/dashboard", authRequired, userController.dashBoard);

export default UserRoutes;
