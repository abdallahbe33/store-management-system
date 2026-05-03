import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { loginUser, registerUser } from "./auth.service";

// Define the register controller function
export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    user,
  });
});

// Define the login controller function
export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);

  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    token: result.token,
    user: result.user,
  });
});
// Define the getMe controller function
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    user: req.user,
  });
});