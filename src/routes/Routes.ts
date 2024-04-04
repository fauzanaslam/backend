import express from "express";

import NewsController from "../controllers/NewsController";
import UserController from "../controllers/UserController";
import verifyToken from "../middleware/Auth";

const router = express.Router();

// news routing
router.get("/news", NewsController.getNews);
router.get("/admin", NewsController.getNews);
router.get("/news/:id", NewsController.getNewsById);
router.post("/admin/add-news", NewsController.createNews);
// router.patch("/customer/:id", NewsController);
router.delete("/admin/:id", NewsController.deleteNews);

// user routing
router.post("/user/signup", UserController.Register);
router.post("/user/login", UserController.UserLogin);
router.get("/user/current-user", UserController.UserDetail);
router.post("/user/logout", UserController.userLogout);
router.get("/user/validate-token", verifyToken, UserController.validateToken);

export default router;
