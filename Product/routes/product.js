const router = require("express").Router();
const Product = require("../models/Product");
const { isLoggedIn, isAdmin } = require("./verification");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const crypto = require("crypto");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const randomImageName = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

// Add a product
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("image"),
  (req, res, next) => {
    const fileName = randomImageName(32);
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    s3.send(new PutObjectCommand(params), (err, data) => {
      if (err) return next(err);

      const newProduct = new Product({
        ...req.body,
        imageUrl: `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`,
        imageName: fileName,
      });
      newProduct.save((err, product) => {
        if (err) return next(err);
        res.status(200).json(product);
      });
    });
  }
);

// Get all products
router.get("/", (req, res, next) => {
  const categoryQuery = req.query.category;
  if (categoryQuery) {
    Product.find({ categories: { $in: [categoryQuery] } }, (err, products) => {
      if (err) return next(err);
      res.status(200).json(products);
    });
  } else {
    Product.find({}, (err, products) => {
      if (err) return next(err);
      res.status(200).json(products);
    });
  }
});

// Get a product
router.get("/:id", (req, res, next) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) return next(err);
    res.status(200).json(product);
  });
});

// Update a product
router.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  upload.single("image"),
  async (req, res, next) => {
    const fileName = randomImageName(32);

    try {
      const product = await Product.findById(req.params.id);
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: product.imageName,
      };
      await s3.send(new DeleteObjectCommand(params));
    } catch (err) {
      return next(err);
    }

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    s3.send(new PutObjectCommand(params), (err, data) => {
      if (err) return next(err);
      req.body.imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;
      req.body.imageName = fileName;
      Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true },

        (err, product) => {
          if (err) return next(err);
          res.status(200).json(product);
        }
      );
    });
  }
);

// Delete a product
router.delete("/:id", isLoggedIn, isAdmin, (req, res, next) => {
  Product.findByIdAndDelete(req.params.id, (err, product) => {
    if (err) return next(err);

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: product.imageName,
    };

    s3.send(new DeleteObjectCommand(params), (err, data) => {
      if (err) return next(err);
      res.status(200).json(product);
    });
  });
});

module.exports = router;
