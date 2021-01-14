const router = require("express").Router();
const { Users } = require("../models/User");
const verification = require("./verification");

/* (verification required)
BASE_URL/wishlist/items   =>  acceptes body data of {user_id, item_id, add(true/false) } 
                          if add === true
                            checks if item if already in wishlist with user_id
                              if not then it adds up to databse
                          else
                            checks if item if already in wishlist with user_id
                              deletes cart item from database
*/

router.post("/items", verification, async (req, res, next) => {
  console.log(req.body);
  const _id = req.body._id;
  const item_id = req.body.item_id;
  const add = req.body.add;
  if (add) {
    const resp = await Users.findOne({ _id: _id, wishList: item_id });
    if (!resp) {
      const response = await Users.findOneAndUpdate(
        { _id: _id },
        { $push: { wishList: item_id } }
      );
      res.json("Added");
    } else next(new Error("already Contains"));
  } else {
    const resp = await Users.findOne({ _id: _id, wishList: item_id });
    if (resp) {
      const response = await Users.findOneAndUpdate(
        { _id: _id },
        { $pull: { wishList: item_id } }
      );
      res.send("removed");
    } else {
      next(new Error("does not Contain"));
    }
  }
});
module.exports = router;
