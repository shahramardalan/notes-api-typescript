import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { registerSchema, loginSchema } from "../validation/user.validation";
import logger from "../logger/logger";

const userService = new UserService();

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      logger.error({ errors }, "Validation failed for register");
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { email, password } = parsed.data;
    const user = await userService.register(email, password);
    res
      .status(201)
      .json({ id: user.id, email: user.email, createdAt: user.createdAt });
  } catch (error: any) {
    logger.error(error, "Failed to register user");
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      logger.error({ errors }, "Validation failed for login");
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { email, password } = parsed.data;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (error: any) {
    logger.error(error, "Failed to login user");
    res.status(401).json({ message: error.message });
  }
};
