import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  if (!req.session.user)
    return res.status(403).json({error: "Not authenticated."});

  const anHourAgo = new Date();
  anHourAgo.setHours(anHourAgo.getHours() - 1);
  res.cookie("AuthState", "", { expires: anHourAgo }).clearCookie("AuthState");
  req.session.user = undefined;
  return res.status(200).send("Logged out!").end();
});

export default router;
