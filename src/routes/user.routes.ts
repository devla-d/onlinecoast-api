import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { AuthMiddleWare } from "../middlewares/auth.middleware";

const UserRoutes = Router();
const userController = new UserController();
const { authRequired } = new AuthMiddleWare();

UserRoutes.get("/dashboard", authRequired, userController.dashBoard);
UserRoutes.get("/transaction-logs", authRequired, userController.transactionS);
UserRoutes.get("/debit-cards", authRequired, userController.debitCard);
UserRoutes.post(
  "/validate-account-numbers",
  authRequired,
  userController.validateAccNumber
);
UserRoutes.get("/account-numbers", authRequired, userController.AccNumbers);
UserRoutes.post("/transfer-same", authRequired, userController.tracSactionSame);
UserRoutes.get(
  "/transaction/:id",
  authRequired,
  userController.transactionSdeTails
);
UserRoutes.post(
  "/transfer-others",
  authRequired,
  userController.tracSactionOthers
);

export default UserRoutes;
