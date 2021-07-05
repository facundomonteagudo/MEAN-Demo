import { RequestHandler } from "express";
import Post, { IPost } from "../models/post";

export const createPost: RequestHandler =  (req, res, next) => {
    const serverUrl = req.protocol + "://" + req.get("host");

     let newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: serverUrl + "/images/" + req.file.filename,
      creator: req.userInfo.userId
    });
    newPost.save().then((createdPost) => {
      res.status(201).json({
        message: "Post added succesfully",
        post: {
          id: newPost._id,
          title: newPost.title,
          content: newPost.content,
          imagePath: newPost.imagePath,
          creator: newPost.creator
        },
      });
    }).catch((error)=>{
      res.status(500).json({message: "Could not create post"});
    });
  }


export const updatePost: RequestHandler = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const serverUrl = req.protocol + "://" + req.get("host");
      imagePath = serverUrl + "/images/" + req.file.filename;
    }
    const postId = req.params.id;
    let post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userInfo.userId
    });
    Post.updateOne({ _id: postId, creator: req.userInfo.userId }, post).then((result: any) => {
      if(result.n > 0){
        res.status(200).json({message: "Post updated succesfully"});
      }else{
        res.status(401).json({message: "Operation not authorized"})
      }
    })
    .catch((error: any) =>{
      res.status(500).json({message: "Could not update post"});
    })
  }

export const deletePost: RequestHandler = (req, res, next) => {
    const postId = req.params.id;
    Post.deleteOne({ _id: postId, creator: req.userInfo.userId }).then((result: any) => {
      if(result.n > 0){
        res.status(200).json({message: "Post " + postId + " deleted succesfully"});
      }else{
        res.status(401).json({message: "Operation not authorized"});
      }
    }).catch((error:any)=>{
      res.status(500).json({message: "Could not delete post."})
    });
  }


export const getSinglePost: RequestHandler = (req, res, next) => {
    Post.findById(req.params.id).then((document) => {
      if (document) {
        res.status(200).json(document);
      } else {
        res
          .status(404)
          .json({ message: "Could not find post with id " + req.params.id });
      }
    }).catch((error:any)=>{
      res.status(500).json({message: "Could not fetch post."})
    });
  }

export const getPosts: RequestHandler = (req, res, next) => {
    const currentPage = req.query.page ? +req.query.page : undefined;
    const pageSize = req.query.pageSize ? +req.query.pageSize : undefined;
    let query = Post.find();
    if (currentPage && pageSize) {
      query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let fetchedPosts: IPost[];
    query
      .then((documents) => {
        fetchedPosts = documents;
        return Post.count(); //if I return inside a then I can then chain another one
      })
      .then((postCount: number) => {
        res.status(200).json({ postAmount: postCount, posts: fetchedPosts });
      }).catch((error:any)=>{
        res.status(500).json({message: "Could not fetch posts."})
      });
  }