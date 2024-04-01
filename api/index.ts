// api/index.ts

require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
var cors = require("cors");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const pool = new Pool({
  connectionString: process.env.DATABASEURI,
});

const getUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  try {
    const { rows } = await pool.query(query, values);
    console.log(rows[0]);
    return rows[0];
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

const getUserID = async (user_id) => {
  try {
    const { rows } = await pool.query(
      `SELECT id FROM useris WHERE user_id = '${user_id}'`
    );
    const id = rows[0];
    return id;
  } catch (error) {
    console.error("Error getting ID:", error);
    return null;
  }
};

export const authHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const isValidPassword = password == user.password;

  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  let token: {
    email: any;
    user_id: any;
    user_type: any;
    username: any;
    [key: string]: any; // Allow token to have additional properties of any type
  } = {
    email: user.email,
    user_id: user.user_id,
    user_type: user.user_type,
    username: user.username,
  };

  const id = await getUserID(user.user_id);
  if (id) {
    token.alphaNumID = id.id;
  } else {
    console.error("Failed to retrieve user ID.");
  }

  res.json({ token });
};

export const verifyHandler = (req, res) => {
  const tokenHeaderKey = "jwt-token";
  const authToken = req.headers[tokenHeaderKey];
  try {
    const verified = jwt.verify(authToken, jwtSecretKey);
    if (verified) {
      return res.status(200).json({ status: "logged in", message: "success" });
    } else {
      return res.status(401).json({ status: "invalid auth", message: "error" });
    }
  } catch (error) {
    return res.status(401).json({ status: "invalid auth", message: "error" });
  }
};

export const checkAccountHandler = async (req, res) => {
  console.log("hi");

  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    const userExists = !!user;

    res.status(200).json({
      status: userExists ? "User exists" : "User does not exist",
      userExists,
    });
  } catch (error) {
    console.error("Error checking account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
