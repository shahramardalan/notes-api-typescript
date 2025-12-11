import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { logger } from "../logger/logger.js";

/**
 * Middleware عمومی برای validation و logging
 * @param schema ZodSchema برای اعتبارسنجی body
 */
export const validateAndLog =
  (schema?: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Log کردن درخواست ورودی
      logger.info({
        message: "Incoming request",
        method: req.method,
        path: req.path,
        body: req.body,
      });

      // اگر schema داده شده است، body را validate می‌کنیم
      if (schema) {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
          const issues = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          }));
          logger.warn({ message: "Validation failed", issues });
          return res.status(400).json({ errors: issues });
        }
        // در صورت موفقیت، req.body همان parsed.data می‌شود
        req.body = parsed.data;
      }

      next(); // ادامه به controller
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error({ message: "Middleware error", error: msg });
      res.status(500).json({ message: "Internal server error" });
    }
  };
