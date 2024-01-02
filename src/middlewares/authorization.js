export function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res
      .status(403)
      .json({ status: "error", message: "You are not authenticated" });
  }
  next();
}
