import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import { connectDB } from "../database/db.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import User from "../models/User.js";
import { generateEmailVerificationTemplate } from "../utils/generateEmailVerificationTemplate.js";
import { generateEmailTemplate } from "../utils/generateForgotPasswordEmailTemplate.js";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";
import { generateVerifyEmailToken } from "../utils/generateVerifyEmailToken.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";

//  Inscription

export const register = catchAsyncErrors(async (req, res, next) => {
  await connectDB();
  const { name, email, password } = req.body;
  const { frontendUrl } = req.query;

  if (!name || !email || !password) {
    return next(
      new ErrorHandler("Veuillez remplir tous les champs obligatoires.", 400),
    );
  }
  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler(
        "Le mot de passe doit comporter entre 8 et 16 caractères",
        400,
      ),
    );
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return next(
      new ErrorHandler(
        "Utilisateur déjà inscrit avec cette adresse e-mail.",
        400,
      ),
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Générer le token de vérification
  const { verifyToken, hashedToken, verifyExpireTime } =
    generateVerifyEmailToken();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    email_verified: false,
    email_verify_token: hashedToken,
    email_verify_expire: new Date(verifyExpireTime),
  });

  // Envoyer l'email de vérification (best-effort : ne bloque pas l'inscription)
  try {
    const baseUrl =
      frontendUrl || process.env.FRONTEND_URL || "https://ets-housseni.com";
    const verifyUrl = `${baseUrl}/email/verify/${verifyToken}`;
    const message = generateEmailVerificationTemplate(verifyUrl, name);

    await sendEmail({
      email: user.email,
      subject: "Confirmez votre adresse e-mail — ETS HOUSSENI",
      message,
    });
  } catch (err) {
    console.warn("[register] Email de vérification non envoyé :", err.message);
    // On ne supprime PAS le token en base : l'utilisateur pourra renvoyer depuis son profil
  }

  sendToken(user, 201, "Compte créé avec succès.", res);
});

//  Vérification de l'e-mail

export const verifyEmail = catchAsyncErrors(async (req, res, next) => {
  await connectDB();
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    where: {
      email_verify_token: hashedToken,
    },
  });

  if (!user) {
    return next(
      new ErrorHandler("Lien de vérification invalide ou expiré.", 400),
    );
  }

  // Vérifier l'expiration
  if (new Date(user.email_verify_expire) < new Date()) {
    return next(
      new ErrorHandler(
        "Ce lien de vérification a expiré. Veuillez en demander un nouveau.",
        400,
      ),
    );
  }

  await user.update({
    email_verified: true,
    email_verify_token: null,
    email_verify_expire: null,
  });

  res.status(200).json({
    success: true,
    message: "Adresse e-mail vérifiée avec succès.",
  });
});

//  Renvoi du lien de vérification

export const resendVerificationEmail = catchAsyncErrors(
  async (req, res, next) => {
    await connectDB();
    const { frontendUrl } = req.query;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return next(new ErrorHandler("Utilisateur introuvable.", 404));
    }
    if (user.email_verified) {
      return next(
        new ErrorHandler("Votre adresse e-mail est déjà vérifiée.", 400),
      );
    }

    const { verifyToken, hashedToken, verifyExpireTime } =
      generateVerifyEmailToken();

    await user.update({
      email_verify_token: hashedToken,
      email_verify_expire: new Date(verifyExpireTime),
    });

    const baseUrl =
      frontendUrl || process.env.FRONTEND_URL || "https://ets-housseni.com";
    const verifyUrl = `${baseUrl}/email/verify/${verifyToken}`;
    const message = generateEmailVerificationTemplate(verifyUrl, user.name);

    try {
      await sendEmail({
        email: user.email,
        subject: "Confirmez votre adresse e-mail — ETS HOUSSENI",
        message,
      });
      res.status(200).json({
        success: true,
        message: `Un nouvel e-mail de confirmation a été envoyé à ${user.email}.`,
      });
    } catch (err) {
      console.error(err);
      return next(new ErrorHandler("Impossible d'envoyer l'e-mail.", 500));
    }
  },
);

//  Connexion

export const login = catchAsyncErrors(async (req, res, next) => {
  await connectDB();
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler(
        "Veuillez fournir votre adresse e-mail et votre mot de passe.",
        400,
      ),
    );
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(
      new ErrorHandler("Adresse e-mail ou mot de passe invalide.", 401),
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return next(
      new ErrorHandler("Adresse e-mail ou mot de passe invalide.", 401),
    );
  }

  sendToken(user, 200, "Connexion réussie.", res);
});

//  Profil

export const getUser = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", { expires: new Date(Date.now()), httpOnly: true })
    .json({ success: true, message: "Déconnexion réussie." });
});

//  Mot de passe oublié

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  await connectDB();
  const { email } = req.body;
  const { frontendUrl } = req.query;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(
      new ErrorHandler(
        "Utilisateur introuvable avec cette adresse e-mail.",
        404,
      ),
    );
  }

  const { hashedToken, resetPasswordExpireTime, resetToken } =
    generateResetPasswordToken();

  user.reset_password_token = hashedToken;
  user.reset_password_expire = new Date(resetPasswordExpireTime);
  await user.save();

  const baseUrl =
    frontendUrl || process.env.FRONTEND_URL || "https://ets-housseni.com";
  const resetPasswordUrl = `${baseUrl}/password/reset/${resetToken}`;
  const message = generateEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Réinitialisation de votre mot de passe — ETS HOUSSENI",
      message,
    });
    res.status(200).json({
      success: true,
      message: `E-mail envoyé avec succès à ${user.email}.`,
    });
  } catch (error) {
    console.error(error);
    user.reset_password_token = null;
    user.reset_password_expire = null;
    await user.save();
    return next(new ErrorHandler("L'e-mail n'a pas pu être envoyé.", 500));
  }
});

//  Réinitialisation du mot de passe

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  await connectDB();
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      reset_password_token: resetPasswordToken,
    },
  });

  if (!user) {
    return next(new ErrorHandler("Token invalide.", 400));
  }

  if (new Date(user.reset_password_expire) < new Date()) {
    return next(new ErrorHandler("Ce lien de réinitialisation a expiré.", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Les mots de passe ne correspondent pas.", 400),
    );
  }
  if (req.body.password?.length < 8 || req.body.password?.length > 16) {
    return next(
      new ErrorHandler(
        "Le mot de passe doit comporter entre 8 et 16 caractères.",
        400,
      ),
    );
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.reset_password_token = null;
  user.reset_password_expire = null;
  await user.save();

  sendToken(user, 200, "Mot de passe réinitialisé avec succès.", res);
});

//  Mise à jour du mot de passe (connecté)

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  await connectDB();
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(
      new ErrorHandler("Veuillez remplir tous les champs obligatoires.", 400),
    );
  }

  const isPasswordMatch = await bcrypt.compare(
    currentPassword,
    req.user.password,
  );
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Le mot de passe actuel est incorrect.", 401));
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler("Les nouveaux mots de passe ne correspondent pas.", 400),
    );
  }
  if (newPassword.length < 8 || newPassword.length > 16) {
    return next(
      new ErrorHandler(
        "Le mot de passe doit comporter entre 8 et 16 caractères.",
        400,
      ),
    );
  }

  const user = await User.findByPk(req.user.id);
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Mot de passe mis à jour avec succès." });
});

//  Mise à jour du profil

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  await connectDB();
  const { name, email } = req.body;
  if (!name || !email) {
    return next(
      new ErrorHandler("Veuillez remplir tous les champs obligatoires.", 400),
    );
  }

  const updateData = { name, email };

  if (req.files && req.files.avatar) {
    const { avatar } = req.files;
    if (req.user?.avatar?.public_id) {
      await cloudinary.uploader.destroy(req.user.avatar.public_id);
    }
    const newProfileImage = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      { folder: "Ecommerce_Avatars", width: 150, crop: "scale" },
    );
    updateData.avatar = {
      public_id: newProfileImage.public_id,
      url: newProfileImage.secure_url,
    };
  }

  const user = await User.findByPk(req.user.id);
  await user.update(updateData);

  res
    .status(200)
    .json({ success: true, message: "Profil mis à jour avec succès.", user });
});

//  Sauvegarde des infos de livraison

export const saveShippingInfo = catchAsyncErrors(async (req, res, next) => {
  const { phone, address, city, state, country, pincode } = req.body;

  if (
    phone === undefined &&
    address === undefined &&
    city === undefined &&
    state === undefined &&
    country === undefined &&
    pincode === undefined
  ) {
    return next(
      new ErrorHandler(
        "Veuillez fournir au moins une information de livraison.",
        400,
      ),
    );
  }

  const user = await User.findByPk(req.user.id);
  const current = user.shipping_info || {};

  const updated = {
    ...current,
    ...(phone !== undefined && { phone: phone || null }),
    ...(address !== undefined && { address: address || null }),
    ...(city !== undefined && { city: city || null }),
    ...(state !== undefined && { state: state || null }),
    ...(country !== undefined && { country: country || null }),
    ...(pincode !== undefined && { pincode: pincode || null }),
  };

  await user.update({ shipping_info: updated });

  res.status(200).json({
    success: true,
    message: "Informations de livraison sauvegardées.",
    shipping_info: user.shipping_info,
    user,
  });
});
