"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const UserRoutes = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
const { authRequired } = new auth_middleware_1.AuthMiddleWare();
UserRoutes.get("/dashboard", authRequired, userController.dashBoard);
UserRoutes.get("/transaction-logs", authRequired, userController.transactionS);
UserRoutes.get("/debit-cards", authRequired, userController.debitCard);
UserRoutes.post("/validate-account-numbers", authRequired, userController.validateAccNumber);
UserRoutes.get("/account-numbers", authRequired, userController.AccNumbers);
UserRoutes.post("/transfer-same", authRequired, userController.tracSactionSame);
UserRoutes.get("/transaction/:id", authRequired, userController.transactionSdeTails);
UserRoutes.post("/transfer-others", authRequired, userController.tracSactionOthers);
UserRoutes.post("/transfer-inter", authRequired, userController.tracSactionInter);
exports.default = UserRoutes;
//# sourceMappingURL=user.routes.js.map