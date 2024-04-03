import express from "express";

import NewsController from "../controllers/NewsController";

const router = express.Router();

// news routing

router.get("/news", NewsController.getNews);
router.get("/news/:id", NewsController.getNewsById);
router.post("/news", NewsController.createNews);
// router.patch("/customer/:id", NewsController);
router.delete("/news/:id", NewsController.deleteNews);

export default router;
