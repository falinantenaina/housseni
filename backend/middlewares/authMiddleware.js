import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token =
    req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(
      new ErrorHandler(
        "Veuillez vous connecter pour accéder à cette ressource.",
        401,
      ),
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // findByPk remplace findById (Sequelize)
  const user = await User.findByPk(decoded.id);
  console.log(user);

  if (!user) {
    return next(new ErrorHandler("Utilisateur introuvable.", 404));
  }

  req.user = user;
  next();
});

export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} n'a pas d'accès à cette ressource`,
          403,
        ),
      );
    }
    next();
  };
};
