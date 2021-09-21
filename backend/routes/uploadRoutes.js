import path from "path";
import express from "express";
import multer from "multer";
import s3Storage from "multer-sharp-s3";
import dotenv from "dotenv";
import aws from "aws-sdk";

dotenv.config();

const router = express.Router();

// 如果是存在Server的硬碟裡面的話
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     )
//   },
// })

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// 存在Amazon的s3
const storage = s3Storage({
  s3,
  Bucket: "merchant-cart",
  ACL: "public-read",
  Key: (req, file, cb) => {
    let productId = req.body.productId;
    cb(
      null,
      `products/${productId}/${Date.now()}${path
        .extname(file.originalname)
        .toLowerCase()}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  res.send(`${req.file.Location}`);
});

export default router;
