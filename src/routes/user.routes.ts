import { Router } from "express";
import { UserController } from "../controller/user.controller";

const UserRoutes = Router();
const userController = new UserController();

UserRoutes.get("/get/:id", userController.dashBoard);

export default UserRoutes;
