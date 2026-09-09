import { verifyToken, authorize } from "./middlewares/auth.middleware.js";

/* Cách viết route

Không cần xác thực
router.post("/login", login); 

Cần xác thực
router.get("/profile", verifyToken, getProfile);

Cần cấp quyền, đối số của authorize là những role được ủy quyền
router.get("/admin/users", verifyToken, authorize("admin"), getAllUsers);

*/