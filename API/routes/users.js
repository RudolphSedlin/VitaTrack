import { Router } from "express";
const router = Router();

router
.route("/")
.get(async (req, res) => {
  if (req.session.user)
    return res.status(200).json(req.session.user);

  return res.status(403).send("Not authenticated!");
  
});

export default router;
