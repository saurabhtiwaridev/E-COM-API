import { mongoose } from "mongoose";

const passwordRegex =
  /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,12}$/;

export const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter valid email",
    ],
  },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        console.log(value);
        return true;
      },
      message:
        "password should be in range 8-12 and it should have at least one specical character",
    },
  },
  type: {
    type: String,
    enum: ["Customer", "Seller"],
  },
});
