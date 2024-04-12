const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3001;

const mongoUrl = 'mongodb+srv://Vikash12345:Vikash12345@cluster0.rtxhqx1.mongodb.net/'; 
const dbName = 'task_manger';
const client = new MongoClient(mongoUrl);

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));


// MongoDB collections
let usersCollection;

// Connect to MongoDB and setup collections
client.connect()
  .then(() => {
    console.log("Connected successfully to MongoDB server");
    const db = client.db(dbName);
    usersCollection = db.collection('users');
    // Add this line if you want a separate collection for profiles
    profilesCollection = db.collection('profiles');
  })
  .catch(error => console.error('Failed to connect to MongoDB:', error));


// Helper functions
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  // Check if user already exists
  const userExists = await usersCollection.findOne({ username: username });
  if (userExists) {
    return res.status(409).send('User already exists');
  }

  try {
    const hashedPassword = await hashPassword(password);
    await usersCollection.insertOne({ username, password: hashedPassword }); // Insert new user in DB
    res.status(201).send('User created successfully. Please login using your credentials.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await usersCollection.findOne({ username: username });

    if (!user) {
      return res.status(401).send('User does not exist');
    }

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

//



app.post('/saveProfile', async (req, res) => {
  try {
    const profileData = req.body;
    // Assume empId is the unique identifier for the profile
    const filter = { empId: profileData.empId };
    const update = { $set: profileData };
    const options = { upsert: true }; // If no record matches, insert a new one

    const result = await profilesCollection.updateOne(filter, update, options);
    if(result.upsertedCount > 0) {
      console.log('Inserted a new profile');
    } else if(result.modifiedCount > 0) {
      console.log('Updated an existing profile');
    }

    res.status(200).json({ message: 'Profile saved successfully', result });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).send('Error saving profile');
  }
});


// Get profile endpoint
app.get('/getProfile', async (req, res) => {
  const userId = req.query.userId;  // Assuming you pass userId as a query parameter
  try {
    const profileData = await profilesCollection.findOne({ empId: userId });
    if (profileData) {
      res.status(200).json(profileData);
    } else {
      res.status(404).send('Profile not found');
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    res.status(500).send('Server error');
  }
});

// Endpoint to check if a profile exists
app.get('/checkProfileExists', async (req, res) => {
  const { empId } = req.query;
  try {
    const profileExists = await profilesCollection.findOne({ empId: empId });
    res.json({ exists: !!profileExists }); // Convert to boolean and send response
  } catch (error) {
    console.error('Failed to check if profile exists:', error);
    res.status(500).send('Server error');
  }
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});