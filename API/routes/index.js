import meals from "./meals.js";
import user from "./users.js";
import login from "./login.js";
import logout from "./logout.js";
import register from "./register.js";

const constructorMethod = (app) => {
  app.use("/meals", meals);
  app.use("/user", user);
  app.use("/login", login);
  app.use("/logout", logout);
  app.use("/register", register);

  app.use("*", (req, res) => {
    return res.status(404).send("No such resource found!")
  });
};

export default constructorMethod;
