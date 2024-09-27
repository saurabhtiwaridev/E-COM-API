import { mongoose } from "mongoose";
import ApplicationError from "../error-handling/applicationError.js";
import { CategorySchema } from "../features/product/category.schema.js";

const url = process.env.DB_URL;

export const connectToMongoose = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await createCategories();
    console.log("mongodb using mongoose is connected");
  } catch (error) {
    throw new ApplicationError("error while connecting to db", 500);
  }
};

const createCategories = async () => {
  const categoryModel = mongoose.model("Category", CategorySchema);

  const caegoriesExist = await categoryModel.find();

  if (!caegoriesExist || caegoriesExist.length == 0) {
    await categoryModel.insertMany([
      { name: "Book" },
      { name: "Electronics" },
      { name: "Furniture" },
      { name: "Electrical" },
    ]);

    console.log("categories are created ");
  }
};
