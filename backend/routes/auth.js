const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require('../middleware/fetchUser')
const JWT_SECRET = "YoYoHoneySingh";
//Create a User using: POST "/api/auth/"
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success,error: "Email already exixits" });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        }
      }
      const token = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({ success,token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
)

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user)
      {
        success=false;
        return res
          .status(400)
          .json({ success,error: "Wrong Credentials!. Please try again." });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare)
      {
        success=false;
        return res
          .status(400)
          .json({ success,error: "Wrong Credentials!. Please try again." });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success,token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error!");
    }
  }
)

router.post(
    "/getuser",
    fetchUser,
    async (req, res) => {
try{
    userId = req.user.id;
    const user =  await User.findById(userId).select("-password");
    res.send(user)
}catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error!"); 
}
    })

module.exports = router;
