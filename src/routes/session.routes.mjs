import { Router } from "express";
import userDao from "../dao/mongoDao/user.dao.mjs";
import { createHash, isValidPassword } from "../utils/bcrypt.mjs";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const userData = req.body;

    // validamos que tengamos todos los datos de registro
    // nuestro form en el front valida estos datos
    // pero si los obtenemos sin el front necesitamos seguridad
    // de que no guardaremos basura en la BBDD

    // user model
    /* 
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    age: Number,
    */

    const { first_name, last_name, email, age, password } = userData;
    if (!first_name || !last_name || !email || !password || !age) {
      return res
        .status(400)
        .send({ status: "Error", msg: "Faltan datos de registro." });
    }

    // hasheamos el password para no guardarlo en plain text en la BBDD
    userData.password = createHash(password);
    //console.log(userData);

    const newUser = await userDao.create(userData);
    if (!newUser) {
      return res
        .status(404)
        .json({ status: "Error", msg: "No se ha podido crear el usuario." });
    }

    res.status(201).json({ status: "success", payload: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", msg: "Internal server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: "Error", msg: "Falta ingresar password o email." });
    }

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = {
        email,
        role: "admin",
      };

      return res
        .status(200)
        .json({ status: "success", payload: req.session.user });
    }

    const user = await userDao.getByEmail(email);
    // validamos si existe el usuario y el password es correcto
    if (!user || !isValidPassword(user, password)) {
      return res
        .status(401)
        .send({ status: "Error", msg: "Invalid user or password." });
    } else {
      req.session.user = {
        email,
        role: "user",
      };
    }

    return res
      .status(200)
      .json({ status: "success", payload: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", msg: "Internal server error." });
  }
});

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
