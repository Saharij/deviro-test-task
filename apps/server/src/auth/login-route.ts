import type { Request, Response } from "express";
import { issueToken } from "./token-store";

const VALID_PASSWORD = "secret1111";

export function loginRouteHandler(req: Request, res: Response) {
  const { password } = req.body as { password?: unknown };

  if (typeof password !== "string" || password !== VALID_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = issueToken();

  res.json({ token });
}
