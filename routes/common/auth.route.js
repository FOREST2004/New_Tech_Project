import express from "express";
import { AuthController } from "../../controllers/common/auth.controller.js";

const router = express.Router();


router.post("/login", AuthController.login);


export default router;
