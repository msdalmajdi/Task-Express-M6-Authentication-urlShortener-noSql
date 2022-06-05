const Url = require("../../models/Url");
const shortid = require("shortid");
const User = require("../../models/User");

const baseUrl = "http:localhost:8090";

exports.shorten = async (req, res) => {
  // create url code
  console.log("I am in shorten function");
  const urlCode = shortid.generate();
  try {
    req.body.shortUrl = baseUrl + "/" + urlCode;
    req.body.urlCode = urlCode;
    req.body.userId = req.user._id;
    const newUrl = await Url.create(req.body);
    await User.findByIdAndUpdate(req.user._id, {
      $push: { urls: newUrl._id },
    });
    res.json(newUrl);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.redirect = async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No URL Found");
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (req.user._id.toString() !== url.userId.toString()) {
      return res.status(401).json("You can only delete your own URLS");
    }
    if (url) {
      await Url.findByIdAndDelete(url._id);
      return res.status(201).json("Deleted");
    } else {
      return res.status(404).json("No URL Found");
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
};
