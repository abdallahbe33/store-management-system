import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { registerUser } from "./auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    user,
  });
});