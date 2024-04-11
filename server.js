const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3001;

// MongoDB setup
// Ensure your MongoDB connection string is correct and secure
const mongoUrl = 'mongodb+srv://Vikash12345:Vikash12345@cluster0.rtxhqx1.mongodb.net/'; 
const dbName = 'task_manger'; 
const client = new MongoClient(mongoUrl);

app.use(cors({
  origin: 'http://localhost:3000', // Isse aapke React development server ke liye allow karega
  methods: ['GET', 'POST'], // Jo methods allow hai unko specify karein
}));
app.use(bodyParser.json());

let users = [];

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Connect to MongoDB
client.connect()
  .then(() => console.log("Connected successfully to MongoDB server"))
  .catch(error => console.error('Failed to connect to MongoDB:', error)); 

app.post('/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).send('User already exists');
  }

  try {
    const hashedPassword = await hashPassword(password);
    users.push({ username, password: hashedPassword });
    console.log('Users list:', users);
    res.status(201).json({ message: 'User created successfully. Please login using your credentials.' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(401).send('User does not exist');
  }

  try {
    const match = await verifyPassword(password, user.password);
    if (match) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Incorrect password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
});

// Endpoint to handle chat message storage
app.post('/storeMessage', async (req, res) => {
  // Yahaan se hum log ko request body ko console mein print karenge debug ke liye
  console.log('Received message:', req.body);
  
  const db = client.db(dbName);
  const collection = db.collection('chatMessages');

  try {
    const result = await collection.insertOne(req.body);
    res.status(200).json({ message: 'Message stored successfully', result });
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).send('Error storing message');
  }
});

app.get('/storeMessage', (req, res) => {
  res.status(200).send('This endpoint is for storing chat messages and can only be accessed with a POST request.');
});

app.get('/getMessages', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('chatMessages');
  
  try {
    const messages = await collection.find({}).toArray(); // Database se saare messages laayein
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).send('Error retrieving messages');
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


