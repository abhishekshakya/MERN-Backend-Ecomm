const router = require("express").Router();
const item = require("../models/item");

/*
BASE_URL/api/items  =>  return all items present in db

BASE_URL/api/items/:id  => returns item info with item_id as id

BASE_URL/api/search/:category  => returns all items from item_category as category

BASE_URL/api/search/:category/:count  => returns count no of items from item_category as category
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

//ONLY FOR THE DEVELOPMENT PHASE//..........................

router.post("/add", async (req, res, next) => {
  //  change this before end
  try {
    if (req.body.length) {
      req.body.map(async (obj) => {
        const product = new item(obj);
        await product.save();
      });
    } else {
      const product = new item(obj);
      await product.save();
    }
    res.status(201).json(req.body);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete", async (req, res, next) => {
  try {
    // console.log(req.body);
    await item.deleteMany(req.body);
    res.status(200).send("Deleted successfully" + req.body);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
