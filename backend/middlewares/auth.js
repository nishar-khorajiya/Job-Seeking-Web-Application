import User  from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler('User Not Authorized', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return next(new ErrorHandler('User Not Authorized', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler('Invalid Token', 401));
  }
});
