import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  age: Number,
});

usersSchema.plugin(mongoosePaginate);

// Moodelo utilizado para manejar la base de datos
export const userModel = mongoose.model(userCollection, usersSchema);
