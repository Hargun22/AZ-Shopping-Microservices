const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    imageName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: Array },
    size: { type: Array },
    categories: { type: Array },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
