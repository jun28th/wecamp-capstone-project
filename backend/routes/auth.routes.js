/* Cách viết route

Không cần xác thực
router.post("/login", login); 

Cần xác thực
router.get("/profile", verifyToken, getProfile);

Cần cấp quyền, đối số của authorize là những role được ủy quyền
router.get("/admin/users", verifyToken, authorize("admin"), getAllUsers);

*/

import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/sign-up", AuthController.SignUp);
router.post("/sign-in", AuthController.SignIn);
router.get("/profile", verifyToken, AuthController.Profile);


export default router;
