import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/register", (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    try {
      if (err) {
        console.error("Error during registration:", err);
        return res
          .status(500)
          .json({ status: "error", msg: "Internal server error." });
      }
      if (!user) {
        return res.status(400).json({
          status: "error",
          msg: info.message || "Invalid registration details",
        });
      }
      // Successful registration
      res.status(201).json({ status: "success", msg: "User registered." });
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      return res
        .status(500)
        .json({ status: "error", msg: "Internal server error." });
    }
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    try {
      if (err) {
        console.error("Error during login:", err);
        return res
          .status(500)
          .json({ status: "Error", msg: "Internal server error." });
      }
      if (!user) {
        return res.status(400).json({
          status: "Error",
          msg: info.message || "Invalid credentials",
        });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Error during login session:", loginErr);
          return res
            .status(500)
            .json({ status: "Error", msg: "Internal server error." });
        }
        // Customize session object if needed
        req.session.user = {
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
          email: user.email,
        };
        return res
          .status(200)
          .json({ status: "success", payload: req.session.user });
      });
    } catch (error) {
      console.error("Unexpected error during login:", error);
      return res
        .status(500)
        .json({ status: "Error", msg: "Internal server error." });
    }
  })(req, res, next);
});

router.get(
  "/github",
  passport.authenticate("github", async (req, res) => {}),
);

router.get(
  "/githubCallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user) {
      req.session.user = req.user; // Asegúrate de que req.user esté definido
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  },
);

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy();
    res
      .status(200)
      .json({ status: "succes", msg: "Sesión cerrada con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", msg: "Internal server error." });
  }
});

export default router;
