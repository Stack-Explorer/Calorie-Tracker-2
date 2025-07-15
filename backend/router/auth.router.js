import express from "express";
import { createUser, deleteUser, editUser, loginUser, logoutUser } from "../utils/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router  = express.Router();

router.post("/create-user",createUser);
router.put("/edit-user",protectRoute,editUser); // protectRoute
router.post("/delete-user",protectRoute,deleteUser); // protectRoute
router.post("/login-user",loginUser);
router.post("/logout-user",logoutUser);

export default router;