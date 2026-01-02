import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";

export enum userRole {
  USER = "user",
  ADMIN = "admin",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const middleware = (...roles: userRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //user verify er jonno user er session dorkar r shei session create hoyece prisma schema te jokhon amra betterauth er maddhome signup create kori..
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any, //request ashle je cookie ta create hoi take decode kore all information session a set kore
      });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!session.user.emailVerified) {
        return res.status(404).json({ message: "Not verified" });
      }

      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as userRole)) {
        return res.status(403).json({ message: "Forbidden Access" });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default middleware;
