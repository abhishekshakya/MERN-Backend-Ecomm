const router = require("express").Router();
const Order = require("../models/Order");
const orders = require("../models/Order");
const { Users } = require("../models/User");
const verification = require("./verification");

/* (verification required)
BASE_URL/order/add   =>  accepts body data of {item_id} 
                      returns json {item_id, order_id, date, status(0-3)}

BASE_URL/order/cancel?id=abcd   => deletes order with id "abcd" from db

BASE_URL/order/get/:user_id  =>  returns order info of user with user_id

*/

router.post("/add", verification, async (req, res, next) => {
  try {
    const item_id = req.body.item_id; //item_id
    const user_id = req.body.user_id; //user_id
    const date = req.body.date;
    const status = req.body.status;
    // console.log(req.body);
    const order = new orders({ item_id, date, status });
    const response = await order.save();
    await Users.findOneAndUpdate(
      { _id: user_id },
      { $push: { orders: response._id } }
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
});

router.post("/cancel", verification, async (req, res, next) => {
  try {
    // console.log(req.body);
    const id = req.body._id; //orderId
    const user_id = req.body.user_id; //userId
    await Users.findOneAndUpdate({ _id: user_id }, { $pull: { orders: id } });
    await orders.deleteOne({ _id: id });
    res.send(`order ${id} deleted`);
  } catch (err) {
    next(err);
  }
});

router.get("/get/:user_id", verification, async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const query1 = await Users.findOne({ _id: user_id }).select("orders -_id");
    const response1 = await query1;
    // console.log(response1.orders);
    const query2 = await Order.find({ _id: { $in: response1.orders } });
    const response2 = await query2;
    // console.log(response2);
    res.json(response2);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
