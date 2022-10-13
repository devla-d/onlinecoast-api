import { Router } from "express";
import AdminController from "../controller/admin.controller";
import { AuthMiddleWare } from "../middlewares/auth.middleware";

const AdminRoutes = Router();
const { dashbaord, allUsers, singleUser, topUpUser, editUser } =
  new AdminController();
const { adminRequired } = new AuthMiddleWare();

AdminRoutes.get("/dashbaord", adminRequired, dashbaord);
AdminRoutes.get("/all-users", adminRequired, allUsers);
AdminRoutes.get("/all-users/:id", adminRequired, singleUser);
AdminRoutes.post("/topup-user", adminRequired, topUpUser);
AdminRoutes.post("/edit-user", adminRequired, editUser);

export default AdminRoutes;
