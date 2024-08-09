import createHttpError from "http-errors";
import { UserModel } from "../models/index.js";

//verifying the user , if exists after decoding from token then send back the details
export const findUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.BadRequest("Please fill all fields");
  return user;
};
