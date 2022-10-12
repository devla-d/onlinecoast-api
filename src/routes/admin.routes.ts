import { Router } from "express";
import AdminController from "../controller/admin.controller";
import { AuthMiddleWare } from "../middlewares/auth.middleware";

const AdminRoutes = Router();
const { dashbaord, allUsers } = new AdminController();
const { adminRequired } = new AuthMiddleWare();

AdminRoutes.get("/dashbaord", adminRequired, dashbaord);
AdminRoutes.get("/all-users", adminRequired, allUsers);

export default AdminRoutes;
//12:40:01:0A:24:80
