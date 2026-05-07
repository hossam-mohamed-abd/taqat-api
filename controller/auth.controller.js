import User from "../model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    let user = req.body;
    // console.log(user);

    let deplicatedEmail = await User.findOne({ email: user.email });
    if (deplicatedEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    let deplicatedUsername = await User.findOne({ username: user.username });
    if (deplicatedUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }
    let newUser = new User(user);
    let savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    let { username , password } = req.body;
    // console.log(email , password);
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }
    let token = jwt.sign({ id: user._id , role : user.role}, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "Login Successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
