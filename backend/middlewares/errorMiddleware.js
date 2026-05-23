class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // ── Erreurs Sequelize ──────────────────────────────────────

  // Contrainte unique violée (ex : email déjà utilisé)
  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors?.[0]?.path || "champ";
    err = new ErrorHandler(
      `La valeur du champ "${field}" est déjà utilisée.`,
      400,
    );
  }

  // Erreur de validation Sequelize (validate: { isEmail }, isIn, etc.)
  if (err.name === "SequelizeValidationError") {
    const message = err.errors.map((e) => e.message).join(" | ");
    err = new ErrorHandler(message, 400);
  }

  // Clé étrangère invalide
  if (err.name === "SequelizeForeignKeyConstraintError") {
    err = new ErrorHandler(
      "Référence invalide : l'enregistrement lié est introuvable.",
      400,
    );
  }

  // Connexion impossible à la base de données
  if (err.name === "SequelizeConnectionError") {
    err = new ErrorHandler(
      "Impossible de se connecter à la base de données.",
      503,
    );
  }

  // Valeur hors plage ou type incompatible
  if (err.name === "SequelizeDatabaseError") {
    err = new ErrorHandler(`Erreur de base de données : ${err.message}`, 400);
  }

  // ── Erreurs JWT ────────────────────────────────────────────

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler(
      "JSON Web Token invalide, veuillez vous reconnecter.",
      400,
    );
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler(
      "JSON Web Token expiré, veuillez vous reconnecter.",
      400,
    );
  }

  // ── Erreur de cast (héritage MongoDB — peu probable mais inoffensif) ──
  if (err.name === "CastError") {
    err = new ErrorHandler(`Valeur invalide pour le champ ${err.path}.`, 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
