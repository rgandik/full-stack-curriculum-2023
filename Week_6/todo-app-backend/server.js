// Importing required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Creating an instance of Express
const app = express();

// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Importing the Firestore database instance from firebase.js
const db = require("./firebase");

// Middlewares to handle cross-origin requests and to parse the body of incoming requests to JSON
app.use(cors());
app.use(bodyParser.json());

// Your API routes will go here...

// GET: Endpoint to retrieve all tasks
app.get("/tasks", async (req, res) => {
  try {
    // Fetching all documents from the "tasks" collection in Firestore
    const snapshot = await db.collection("tasks").get();
    
    let tasks = [];
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,  // Document ID from Firestore
        ...doc.data(),  // Document data
      });
    });
    
    // Sending a successful response with the tasks data
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// GET: Endpoint to retrieve all tasks for a user
app.get("/tasks/:user", async (req, res) => {
  try {
    // Sets the user variable to the query parameter provided in the request URL
    const user = req.params.user

    // Fetching all documents from "tasks" for a specific user
    const snapshot = await db.collection("tasks").where("user", "==", user).get();

    let tasks = [];
    // Collects the data for each document pulled for the specified user
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id, // Firestore-generated document ID
        ...doc.data() // Rest of the document data (finished, task, user)
      })
    })

    // Response sent with the data recorded in tasks array (200 for GET)
    res.status(200).send(tasks);
  } catch (error) {
    // In case of an error with request, sends an error message instead
    res.status(500).send(error.message);
  }
})

// POST: Endpoint to add a new task
app.post("/tasks", async (req, res) => {
  try {
    // Sets the data object to the provided key-value pairs in the request body
    const data = {
      "finished": req.body.finished,
      "task": req.body.task,
      "user": req.body.user
    }

    // Checks if all fields of the POST request body exist to prevent adding incomplete tasks
    if (data.finished == undefined || data.task == undefined || data.user == undefined) {
      return res.json({
        msg: "Error: not all POST parameters provided",
        data: {}
      })
    } else {
      // Makes the POST request to the database with contents of data object
      const addedTask = await db.collection("tasks").add(data);
      
      // Response with data from POST request and Firestore-generated ID (201 for POST)
      res.status(201).send({
        id: addedTask.id, // Automatically generated Document ID from Firestore
        ...data
      });
    }
  } catch {
    // In case of an error with request, sends an error message instead
    res.status(500).send(error.message);
  }
})

// DELETE: Endpoint to remove a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    // Sets the id variable to the query parameter provided in the request URL
    const id = req.params.id

    // Deletes the document from "tasks" with the provided id
    const deletedTask = await db.collection("tasks").doc(id).delete();

    // Empty response for successful DELETE request (204 for DELETE)
    res.status(204).send()
  } catch {
    // In case of an error with request, sends an error message instead
    res.status(500).send(error.message);
  }
})

// Setting the port for the server to listen on
const PORT = process.env.PORT || 3001;
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});