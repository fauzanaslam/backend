import express from "express";

import NewsController from "../controllers/NewsController";

const router = express.Router();

// news routing

router.get("/news", NewsController.getNews);
router.get("/admin", NewsController.getNews);
router.get("/news/:id", NewsController.getNewsById);
router.post("/admin/add-news", NewsController.createNews);
// router.patch("/customer/:id", NewsController);
router.delete("/admin/:id", NewsController.deleteNews);

export default router;
