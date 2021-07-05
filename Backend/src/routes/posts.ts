import { Router } from "express";
import { checkAuth } from "../middleware/check-auth";
import {
  createPost,
  updatePost,
  deletePost,
  getSinglePost,
  getPosts,
} from "../controllers/posts";
import { multerImageReader } from "../middleware/multer-image-reader";
const router = Router();



router.post(
  "/posts",
  checkAuth,
  multerImageReader,
  createPost
);

router.put(
  "/posts/:id",
  checkAuth,
  multerImageReader,
  updatePost
);

router.delete("/posts/:id", checkAuth, deletePost);

router.get("/posts/:id", getSinglePost);

router.get("/posts", getPosts);

export default router;
