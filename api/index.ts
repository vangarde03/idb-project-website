require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

process.env.DATABASEURI; //to get vercel to work

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
const executeQuery = async (query: string) => {
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

// Route to handle queries
app.post("/query", async (req, res) => {
  const { query } = req.body;
  try {
    const result = await executeQuery(query);
    res.send(result); // Send the raw response data without transformation
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).send("Internal server error"); // Send an error message without JSON formatting
  }
});

// Authentication handler
app.post("/auth", async (req, res) => {
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
});

// Verification handler
app.post("/verify", (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

// Flag to differentiate between original requests and redirected requests
let redirecting = false;

// Catch-all route for GET requests
app.get("*", (req, res) => {
  if (!redirecting) {
    // Set flag to indicate redirection
    redirecting = true;
    // Reload the page by redirecting to the same URL
    res.redirect(req.originalUrl);
  } else {
    // Reset flag for subsequent requests
    redirecting = false;
    // Allow the request to pass through without redirection
  }
});

// Check account handler
app.post("/check-account", async (req, res) => {
  try {
    if (!req.body || !req.body.email) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    const { email } = req.body;
    const user = await getUserByEmail(email);
    const userExists = !!user;

    res.status(200).json({
      status: userExists ? "User exists" : "User does not exist",
      userExists,
    });
  } catch (error) {
    console.error("Error checking account:", error);
    res
      .status(500)
      .json({ error: "Internal server error", caughtError: error.message });
  }
});

module.exports = app;
