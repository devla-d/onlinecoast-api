import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { AuthMiddleWare } from "../middlewares/auth.middleware";

const UserRoutes = Router();
const userController = new UserController();
const { authRequired } = new AuthMiddleWare();

UserRoutes.get("/dashboard", authRequired, userController.dashBoard);
UserRoutes.get("/transaction-logs", authRequired, userController.transactionS);
UserRoutes.get("/debit-cards", authRequired, userController.debitCard);

export default UserRoutes;
