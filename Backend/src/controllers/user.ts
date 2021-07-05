import { RequestHandler } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const registerUser: RequestHandler = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
      const user = new User({ email: req.body.email, password: hashedPassword });
      user
        .save()
        .then((result) => {
          res.status(201).json({
            message: "User created succesfully",
            result: result,
          });
        })
        .catch((error) => {
          res.status(500).json({ message: "Email is already in use."} );
        });
    });
  }



export const loginUser: RequestHandler = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new Error("Invalid authentication credentials");
      }
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isValidPassword) {
        throw new Error("Invalid authentication credentials");
      }
      const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_KEY!, {
        expiresIn: "1h",
      });
      res.status(200).json({ token: token, expiresIn: 3600, userId: user._id});
    } catch (err) {
      res.status(401).json({ message: `${err.message}` });
    }
  }