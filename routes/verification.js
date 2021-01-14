const jwt = require("jsonwebtoken");

const verification = (req, res, next) => {
  // console.log(req.headers);
  jwt.verify(
    req.headers.auth_token.split(" ")[1],
    process.env.SECRET,
    (err, decoded) => {
      if (err) {
        // console.log("err");
        next(new Error("Invalid Token"));
      } else {
        // console.log("welcome");
        next();
      }
    }
  );
};

module.exports = verification;
