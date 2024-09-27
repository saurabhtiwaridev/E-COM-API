import { mongoose } from "mongoose";

export const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productId: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  quantity: {
    type: Number,
  },
});
