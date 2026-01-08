import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let message = "Internel server error";
  let error = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Your provided field is incorrect or  missing";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      message =
        "The value {field_value} stored in the database for the field {field_name} is invalid for the field's type";
    } else if (err.code === "P2002") {
      statusCode = 400;
      message = "Dupicate key error";
    } else if (err.code === "P2003") {
      statusCode = 400;
      message = "Foregin key constrain failed";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 54001;
    message = "query engine returns an error that does not have a predefined";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 1;
    message = "panicked at 'internal error: entered unreachable code'";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      (statusCode = 401),
        (message = "Authentication failed against database serve");
    } else if (err.errorCode === "P1001") {
      (statusCode = 401), (message = "Can't reach database server");
    }
  }

  res.status(statusCode);
  res.json({
    message: message,
    error: error,
  });
}
export default errorHandler;
