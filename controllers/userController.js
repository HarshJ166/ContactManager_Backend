const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//@desc Register the user
//@route POST /api/users/register
//@access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists");
  }

  //Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(user);

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
  res.json({ message: "Register the user" });
});

//@desc Login the user
//@route POST /api/users/login
//@access Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }
  const user = await User.findOne({ email });
  //compare password with hash password

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json(accessToken);
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  res.json({ message: "Login the user" });
});

//@desc Current the user
//@route GET /api/users/current
//@access Private

const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "Current  user info" });
});

module.exports = { registerUser, loginUser, currentUser };
