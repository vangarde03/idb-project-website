require('dotenv').config();


const express = require('express')
const bcrypt = require('bcrypt')
var cors = require('cors')
const jwt = require('jsonwebtoken')
// var low = require('lowdb')
// var FileSync = require('lowdb/adapters/FileSync')
// var adapter = new FileSync('./database.json')
// var db = low(adapter)

// Initialize Express app
const app = express()

// Define a JWT secret key. This should be isolated by using env variables for security
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Set up CORS and JSON middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => res.send("Express on Vercel"));



const { Pool } = require('pg');


// Create a pool of database connections
const pool = new Pool({
  // user: process.env.DB_USERNAME,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  connectionString: process.env.DATABASEURI,
  // port: process.env.DB_PORT,
});

// Example query to retrieve user information
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  try {
    const { rows } = await pool.query(query, values);
    console.log(rows[0]);
    return rows[0]; // Assuming the query returns a single user row
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error; // Rethrow the error to be caught by the caller
  }

};

const getUserID = async (user_id) => {
  try {
    // Assuming you're using some database library or ORM to query the database
    // Replace this part with your actual database querying code
    const { rows } = await pool.query(`SELECT id FROM useris WHERE user_id = '${user_id}'`);

    // Assuming the query result is an array with one object containing the id
    // Extract the id from the query result
    const id = rows[0];

    return id;
  } catch (error) {
    console.error('Error getting ID:', error);
    return null; // or handle the error appropriately
  }
};


// Example authentication endpoint
app.post('/auth', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const isValidPassword = (password == user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  console.log(user);

  // const token = jwt.sign({ message: "success", email: user.email, user_id: user.user_id, user_type: user.user_type, username: user.username }, jwtSecretKey);
  let token = {
    email: user.email,
    user_id: user.user_id,
    user_type: user.user_type,
    username: user.username
  };

  const id = await getUserID(user.user_id);
  if (id) {
    token.alphaNumID = id.id;
  } else {
    console.error('Failed to retrieve user ID.');
    // Handle the error appropriately
  }


  res.json({ token });

});

//security vulnerability above




app.post('/verify', (req, res) => { //this may not work
  const tokenHeaderKey = 'jwt-token'
  const authToken = req.headers[tokenHeaderKey]
  try {
    const verified = jwt.verify(authToken, jwtSecretKey)
    if (verified) {
      return res.status(200).json({ status: 'logged in', message: 'success' })
    } else {
      // Access Denied
      return res.status(401).json({ status: 'invalid auth', message: 'error' })
    }
  } catch (error) {
    // Access Denied
    return res.status(401).json({ status: 'invalid auth', message: 'error' })
  }
})


// An endpoint to see if there's an existing account for a given email address
app.post('/check-account', async (req, res) => {

  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    const userExists = !!user; // Check if user exists

    res.status(200).json({
      status: userExists ? 'User exists' : 'User does not exist',
      userExists,
    });
  } catch (error) {
    console.error('Error checking account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Start the Express server
const PORT = process.env.PORT || 3000; // Use the port provided by the environment or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;