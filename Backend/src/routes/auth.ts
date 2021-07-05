import { Router } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../controllers/user";

const router = Router();

router.post("/user/signup", registerUser);

router.post("/user/login", loginUser);

export default router;
