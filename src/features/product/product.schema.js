import { mongoose } from "mongoose";

export const ProductSchema = new mongoose.Schema({
  name: String,
  desc: String,
  price: Number,
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
