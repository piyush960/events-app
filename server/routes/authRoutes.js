import { Router } from "express";
import { process_auth, process_callback, process_logout } from "../controllers/authController.js";

const router = Router();

router.get('/process-auth', process_auth)

router.get('/oauth2callback', process_callback)

router.get('/logout', process_logout)

export default router;