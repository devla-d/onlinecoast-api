import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { AuthMiddleWare } from "../middlewares/auth.middleware";

const AuthRouter = Router();
const authMiddleware = new AuthMiddleWare();
const authController = new AuthController();

AuthRouter.post(
  "/sign-up",
  authMiddleware.validateRegistration,
  authController.regisTer
);
AuthRouter.post("/sign-up-verify", authController.verifyRegisTer);
AuthRouter.post(
  "/create-new-account",
  authMiddleware.validateCreateUser,
  authController.createAccount
);
AuthRouter.get("/available-user-details", authController.availableData);
AuthRouter.post("/sign-in", authController.logIN);
AuthRouter.post("/forgot-password", authController.forgetPassword);
AuthRouter.post("/verify-reset-password", authController.resetPasswordVerify);
export default AuthRouter;
