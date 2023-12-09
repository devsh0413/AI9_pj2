const multerS3 = require("multer-s3");
const multer = require("multer");
const dayjs = require("dayjs");
const s3Client = require("../db/aws");
const fileFilter = require("./fileFilter");

const storage = multerS3({
  s3: s3Client,
  bucket: "turtine-image",
  acl: "public-read-write",
  key: (req, file, cb) => {
    const key = `${dayjs().format("YYYY-MM-DD")}-${file.originalname}`;
    cb(null, key);
  },
});

const upload = multer({
  storage: storage,
  fileFilter,
});

module.exports = upload;
