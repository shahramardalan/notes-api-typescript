import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.register(email, password);
    res.status(201).json({ message: "User registered", user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
