import express from "express";
import { deleteUserData, editUserData,  getUserData, postUserData } from "../utils/logic.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/get-userdata",protectRoute,getUserData);
router.post("/post-userdata",protectRoute,postUserData);
router.put("/edit-userdata/:dateid/:fooditemid",protectRoute,editUserData);
router.delete("/delete-userdata/:dateid/:fooditemid",protectRoute,deleteUserData);

export default router;