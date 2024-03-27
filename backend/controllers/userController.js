import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import  User  from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import bcrypt from 'bcrypt';

export const register = catchAsyncErrors( async(req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ErrorHandler("Email already registered!"));
    }

    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
      name,
      email,
      phone:phone.toString(),
      password: hashedPassword,
      role,
    });
    
    sendToken(user, 201, res, "User Registered!");
  } catch (error) {
    return next(new ErrorHandler("Failed to register user.", 500));
  }
});

export const login = async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role."));
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new ErrorHandler("Invalid Email.", 400));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log(isPasswordMatched)
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Password.", 400));
    }

    if (user.role !== role) {
      return next(
        new ErrorHandler(`User with provided email and ${role} not found!`, 404)
      );
    }

    sendToken(user, 201, res, "User Logged In!");
  } catch (error) {
    return next(new ErrorHandler("Failed to login.", 500));
  }
};

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
