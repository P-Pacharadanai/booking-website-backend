import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      created_at: new Date(),
      updated_at: new Date(),
      last_logged_in: new Date(),
    };

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);

    await pool.query(
      `insert into users (username, email, phone, password,created_at,updated_at,last_logged_in)  
      values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        user.username,
        user.email,
        user.phone,
        user.password,
        user.created_at,
        user.updated_at,
        user.last_logged_in,
      ]
    );

    return res.json({
      message: "User has been created successfully",
    });
  } catch (error) {
    let errorMessage = null;

    if (error.message === 'duplicate key value violates unique constraint "users_username_key"') {
      errorMessage = "This username is already taken.";
    } else if (
      error.message === 'duplicate key value violates unique constraint "users_email_key"'
    ) {
      errorMessage = "This email is already taken.";
    }

    if (errorMessage) {
      return res.status(409).json({
        message: errorMessage,
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(`select * from users where email=$1`, [email]);

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const lastLogin = new Date();
    await pool.query(`update users set last_logged_in=$1 where email=$2`, [lastLogin, email]);

    const payload = {
      id: user.user_id,
      username: user.username,
      email: user.email,
    };

    const signOptions = {
      expiresIn: "1h",
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, signOptions);

    return res.json({
      message: "login successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

export default authRouter;
