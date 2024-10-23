import { Router } from "express";
import { userData } from "../data/index.js";
const router = Router();

router
.route("/")
.get(async (req, res) => {
  if (req.session.user)
    return res.status(200).json(req.session.user);

  return res.status(403).send("Not authenticated!");
  
})
.delete(async (req, res) => {
  try {
    if (req.session.user) {
      const anHourAgo = new Date();
      anHourAgo.setHours(anHourAgo.getHours() - 1);
      res.cookie("AuthState", "", { expires: anHourAgo }).clearCookie("AuthState");
      userData.remove(req.session.user._id);
      req.session.user = undefined;
      return res.status(200).send("User deleted!");
    }

    return res.status(403).send("Not authenticated!");
  }
  catch (error) {
    return res.status(500).send(error);
  }
})
.put(async (req, res) => {
  try {
    if (req.session.user) {
      let user = req.body;
      user["_id"] = req.session.user._id;
      let update = await userData.updateUser(user);

      req.session.user = await userData.getUserByID(req.session.user._id);
      return res.status(200).json(update);
    }

    return res.status(403).send("Not authenticated!");
  }
  catch (error) {
    return res.status(403).send(error);
  }
})
;

export default router;
