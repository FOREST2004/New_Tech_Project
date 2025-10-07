import express from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import { MemberController } from "../../controllers/admin/member.controller.js";

const router = express.Router();



router.use(authMiddleware);
router.use(requireRole('ADMIN'));


router.get("/list", MemberController.getMembersList);


router.get("/:id", MemberController.getMemberById);


router.post("/create", MemberController.createMember);


router.put("/:id/lock", MemberController.lockMember);


router.put("/:id/unlock", MemberController.unlockMember);


router.put("/:id/reset-password", MemberController.resetPassword);

export default router;
