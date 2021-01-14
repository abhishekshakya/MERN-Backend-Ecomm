const { Users, Address } = require("../models/User");
const verification = require("./verification");
const router = require("express").Router();

/*
BASE_URL/order/:id  =>  returns addresses of user with id = :id

BASE_URL/order/add  =>  accepts {id(user_id), add(address), heading(heading of address), default(if it is default address)} in request body
                        adds address to users db

BASE_URL/order/remove  =>  accepts {id(user_id), add_id(address id)} in request body
                        removes address to users db

BASE_URL/order/edit  =>  accepts {id(user_id), add(address), new_add(new address)} in request body
                        updates corresponding address of users in db

*/

router.get("/:id", verification, async (req, res, next) => {
  try {
    const resp = await Users.find(
      { _id: req.params.id },
      { address: 1, _id: 0 }
    );
    const data = await resp;
    // console.log(data);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/add", verification, async (req, res, next) => {
  try {
    const id = req.body.id;
    const heading = req.body.heading;
    const add = req.body.add;
    const user_default = req.body.default;
    const address = new Address({ heading, add, user_default });
    // console.log(address);
    const resp = await Users.findOneAndUpdate(
      { _id: id },
      { $push: { address: address } }
    );
    res.send("ok");
  } catch (err) {
    next(err);
  }
});

router.post("/remove", verification, async (req, res, next) => {
  try {
    const id = req.body.id;
    const add_id = req.body.add_id;
    const resp = await Users.findOneAndUpdate(
      { _id: id },
      { $pull: { address: { _id: add_id } } }
    );
    res.send("ok");
  } catch (err) {
    next(err);
  }
});

router.post("/edit", verification, async (req, res, next) => {
  try {
    const id = req.body.id;
    const add_id = req.body.add_id;
    const new_add = req.body.new_add;
    const resp = await Users.findOneAndUpdate(
      { _id: id, "address._id": add_id },
      { $set: { "address.$.add": new_add } }
    );
    // const data = await resp;
    // console.log(data);
    res.send("ok");
  } catch (err) {
    next(err);
  }
});

const makeAllUndefault = async (id) => {
  await Users.findOneAndUpdate(
    { _id: id },
    { $set: { "address.$[].user_default": false } }
  );
};

router.post("/default", verification, async (req, res, next) => {
  try {
    const id = req.body.id;
    const add_id = req.body.add_id;
    await makeAllUndefault(id);
    const resp = await Users.findOneAndUpdate(
      { _id: id, "address._id": add_id },
      { $set: { "address.$.user_default": true } }
    );

    res.send("ok");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
