const router = require("express").Router();
const item = require("../models/item");
const Order = require("../models/Order");
const { Users } = require("../models/User");
const verification = require("./verification");

/*
BASE_URL/api/items  =>  return all items present in db

BASE_URL/api/items/:id  => returns item info with item_id as id

BASE_URL/api/search/:category  => returns all items from item_category as category

BASE_URL/api/search/:category/:count  => returns count no of items from item_category as category

availiable categories = Mugs, Bedsheets, T-Shirts, Curtains, Clothes 
*/

router.get("/items", async (req, res, next) => {
  try {
    const responseQuery = item.find();
    const data = await responseQuery;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/item/:id", async (req, res, next) => {
  try {
    const query = await item.find({ _id: req.params.id });
    const data = await query;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/search/:category", async (req, res, next) => {
  try {
    const query = await item.find({ category: req.params.category });
    const data = await query;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/query", async (req, res, next) => {
  try {
    // console.log(req.query.str);
    let str = req.query.str.split(" ").join(".*");
    const query = await item
      .find(
        {
          title: { $regex: new RegExp(".*" + str + ".*", "i") },
        },
        { title: 1 }
      )
      .limit(10);
    const data = await query;
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/search/:category/:count", async (req, res, next) => {
  try {
    const query = await item
      .find({ category: req.params.category })
      .limit(Number(req.params.count));
    const data = await query;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

////for admin to add or delete product

router.post("/add", verification, async (req, res, next) => {
  //  change this before end
  try {
    // if (req.body.length) {
    //   req.body.map(async (obj) => {
    //     const product = new item(obj);
    //     await product.save();
    //   });
    // } else {
    const product = new item(req.body);
    const resp = await product.save();
    // }
    // console.log(resp);
    res.status(201).send(resp._id);
  } catch (error) {
    // console.log(error);
    next(error);
  }
});

router.delete("/delete", verification, async (req, res, next) => {
  try {
    await item.deleteOne({ _id: req.body.item_id });

    await Users.updateMany(
      { wishList: { $all: req.body.item_id } },
      { $pull: { wishList: req.body.item_id } }
    );

    await Users.updateMany(
      { cart: { $all: req.body.item_id } },
      { $pull: { cart: req.body.item_id } }
    );

    const resp = await Order.find({ item_id: req.body.item_id });
    // console.log(resp);

    resp.forEach(async (order) => {
      await Users.updateMany(
        { orders: { $all: order._id } },
        { $pull: { orders: order._id } }
      );
      await Order.deleteOne({ _id: order._id });
    });

    // console.log(resp1, resp2);
    // await Users.deleteMany({item_id: req.body._id});
    res.status(200).send("Deleted successfully " + req.body._id);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
