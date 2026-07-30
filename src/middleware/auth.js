import jwt from "jsonwebtoken";

export default function authMidlleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "no authorozed token found" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decode.userId;

    next();
  } catch (err) {
    res.status(401).json({ error: "invalide or Expired Token" });
  }
}
