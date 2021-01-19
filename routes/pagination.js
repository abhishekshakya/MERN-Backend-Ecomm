const item = require("../models/item");
const router = require("express").Router();

/*
1 = 1 10
2 = 11 20
*/

router.get("/", async (req, res) => {
  const pageNo = req.query.pageNo;
  const itemCount = req.query.itemCount;
  const skip = (pageNo - 1) * itemCount;

  const response = await item
    .find()
    .sort()
    .skip(parseInt(skip))
    .limit(parseInt(itemCount));
  const data = await response;
  res.json(data);
});

router.get("/:category", async (req, res, next) => {
  try {
    const pageNo = req.query.pageNo;
    const itemCount = req.query.itemCount;
    const skip = (pageNo - 1) * itemCount;
    const query = await item
      .find({ category: req.params.category })
      .sort()
      .skip(parseInt(skip))
      .limit(parseInt(itemCount));
    const data = await query;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
