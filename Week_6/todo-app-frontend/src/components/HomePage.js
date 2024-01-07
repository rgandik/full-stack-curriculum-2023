import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const navigate = useNavigate();

  // Imports the global state variable currentUser
  const { currentUser } = useAuth();
  
  // State to hold the list of tasks.
  const [tasks, setTasks] = useState([]);
  // State for the task name being entered by the user.
  const [taskName, setTaskName] = useState("");

  // TODO: Support retrieving your todo list from the API.
  // Currently, the tasks are hardcoded. You'll need to make an API call
  // to fetch the list of tasks instead of using the hardcoded data.

  // Called whenever the logged in (currentUser) changes
  useEffect(() => {
    // If not logged in (not currentUser), returns to login page
    if (!currentUser) {
      navigate("/login")
    // Otherwise, pulls (GETS) all tasks for currentUser
    } else {
      fetch(`http://localhost:3001/tasks/${currentUser.email}`)
      .then((response) => response.json())
      .then((response) => {
        // Creates an array to store the set of objects (tasks)
        let list = []
        // Each task is appended to the end of the array as an object with an id, user, name, and completion status
        response.forEach((task) => {
          list.push({ id: task.id, user: task.user, name: task.task, finished: task.finished })
        })
        // After the array is created, tasks is set to the array and the list is rendered
        setTasks(list)
      })
      .catch((error) => {console.error(error)})
    }
  }, [currentUser])

  function addTask() {
    // Check if task name is provided and if it doesn't already exist.
    if (taskName && !tasks.some((task) => task.name === taskName)) {

      // TODO: Support adding todo items to your todo list through the API.
      // In addition to updating the state directly, you should send a request
      // to the API to add a new task and then update the state based on the response.

      // Sends a POST request to add the new task to the database
      fetch(`http://localhost:3001/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            /* Passes "Authorization" key-value pair in header containing Bearer token pulled from currentUser
            variable to allow access to secure API calls (like POST); since state variables reset on webpage reload,
            currentUser.accessToken will be empty after reloading the page so the call will fail */
            "Authorization": "Bearer " + currentUser.accessToken
          },
          body: JSON.stringify({
            // The user is set to the username of the logged in (currentUser) as a string
            "user": currentUser.email,
            // The task is set to taskName, which is pulled from the input field at function call
            "task": taskName,
            "finished": false
          })
        })
        .then((response) => response.json())
        // Appends the task to the list of previous tasks using the data returned from the server (including id)
        .then((data) => {
          if (data.id) {
            setTasks([...tasks, { id: data.id, user: data.user, name: data.task, finished: data.finished}])
            //console.log(data.task + " has been added")
          }
        })
        .catch((error) => {console.error(error)})
        // Clears taskName after the new task is POSTed
        setTaskName("");
    } else if (tasks.some((task) => task.name === taskName)) {
      alert("Task already exists!");
    }
  }

  let id = ""

  // Function to toggle the 'finished' status of a task.
  function updateTask() {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, finished: !task.finished } : task
      )
    );
  }

  // TODO: Support removing/checking off todo items in your todo list through the API.
  // Similar to adding tasks, when checking off a task, you should send a request
  // to the API to update the task's status and then update the state based on the response.

  // Called whenever tasks is set (ie. after updateTask is executed)
  useEffect(() => {
    // When a task has been marked finished, sends a request to DELETE the task from the database using its id
    tasks.forEach((task) => {
      if (task.finished /*&& task.id === id*/) {
        fetch(`http://localhost:3001/tasks/${task.id}`, {
          method: "DELETE",
          headers: {
            /* Passes "Authorization" key-value pair in header containing Bearer token pulled from currentUser
            variable to allow access to secure API calls (like POST); since state variables reset on webpage reload,
            currentUser.accessToken will be empty after reloading the page so the call will fail */
            "Authorization": "Bearer " + currentUser.accessToken
          }
        })
        .catch((error) => {console.error(error)})
        //console.log(task.name + " has been deleted")
      }
    })
  }, [tasks])

  // Function to compute a message indicating how many tasks are unfinished.
  function getSummary() {
    const unfinishedTasks = tasks.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        {/* Main layout and styling for the ToDo app. */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Display the unfinished task summary */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {getSummary()}
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Input and button to add a new task */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small" // makes the textfield smaller
                  value={taskName}
                  placeholder="Type your task here"
                  onChange={(event) => setTaskName(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addTask}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* List of tasks */}
            <List sx={{ marginTop: 3 }}>
              {tasks.map((task) => (
                <ListItem
                  key={task.id}
                  dense
                  onClick={() => (id = task.id, updateTask())}
                >
                  <Checkbox
                    checked={task.finished}
                  />
                  <ListItemText primary={task.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}
