const router = require("express").Router();
const { Users } = require("../models/User");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verification = require("./verification");

/*(verification required)
BASE_URL/auth/:id  =>  finds user info from db

BASE_URL/auth/signup  =>  accepts body with {username, email, password}
                          checks if email already exists in db
                            if not then it creates new user in db and save hashed password in db

                          returns json object with {user_id, user_name, jsonWebToken}

BASE_URL/auth/login  =>  accepts body with { email, password }
                          checks if email already exists in db
                            if yes then match request.body.password with one in db

                          returns json object with {user_id, user_name, jsonWebToken}
*/

const SignInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).trim().required(),
});

const SignUpSchema = Joi.object({
  name: Joi.string().alphanum().min(3).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).trim().required(),
});

router.get("/:id", verification, async (req, res) => {
  const response = Users.find({ _id: req.params.id });
  const userData = await response;
  // console.log(userData);
  res.json(userData);
});

router.post("/signup", async (req, res, next) => {
  try {
    const value = SignUpSchema.validate(req.body);
    if (value.error) {
      const err = new Error(value.error.details[0].message);
      throw err;
    } else {
      //chk if user is already availiable or not
      const dbUser = await Users.findOne({ email: req.body.email });

      if (!dbUser) {
        const password = await bcrypt.hash(req.body.password, 10);
        const user = new Users({ ...req.body, password });
        const dbUser = await user.save();
        const token = jwt.sign(
          { name: dbUser.name, email: dbUser.email, _id: dbUser._id },
          process.env.SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.json({
          name: dbUser.name,
          _id: dbUser._id,
          token,
          admin: dbUser.admin,
        });
      } else {
        throw new Error("User already exists :(");
      }
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // console.log(req.body);
    const value = SignInSchema.validate(req.body);
    if (value.error) {
      const err = new Error(value.error.details[0].message);
      throw err;
    } else {
      //chk if user is already availiable or not
      const dbUser = await Users.findOne({ email: req.body.email });

      if (dbUser) {
        //user exist
        const validPass = await bcrypt.compare(
          req.body.password,
          dbUser.password
        );
        if (validPass) {
          //valid password
          const token = jwt.sign(
            { name: dbUser.name, email: dbUser.email, _id: dbUser._id },
            process.env.SECRET,
            {
              expiresIn: "1d",
            }
          );

          res.json({
            name: dbUser.name,
            _id: dbUser._id,
            token,
            admin: dbUser.admin,
          });
        } else {
          //invalid password
          throw new Error("password does'nt match");
        }
      } else {
        //invalid user
        throw new Error("User does'nt exist");
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
