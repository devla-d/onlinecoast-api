"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controller/admin.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const AdminRoutes = (0, express_1.Router)();
const { dashbaord, allUsers, singleUser, topUpUser, editUser, allTransactions, singleTransactions, editTransaction, } = new admin_controller_1.default();
const { adminRequired } = new auth_middleware_1.AuthMiddleWare();
AdminRoutes.get("/dashbaord", adminRequired, dashbaord);
AdminRoutes.get("/all-users", adminRequired, allUsers);
AdminRoutes.get("/all-users/:id", adminRequired, singleUser);
AdminRoutes.post("/topup-user", adminRequired, topUpUser);
AdminRoutes.post("/edit-user", adminRequired, editUser);
AdminRoutes.get("/all-transactions", adminRequired, allTransactions);
AdminRoutes.get("/all-transactions/:id", adminRequired, singleTransactions);
AdminRoutes.post("/edit-transactions", adminRequired, editTransaction);
exports.default = AdminRoutes;
//# sourceMappingURL=admin.routes.js.map