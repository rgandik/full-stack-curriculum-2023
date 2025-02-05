# Week 6: Introduction to NodeJS and Databases

We have officially transitioned to the backend portion of the full-stack course! This week, we will go over creating API's in ExpressJS, a popular NodeJS library. We will go over how to structure your backend projects, what middleware is, and how to interact with databases.

Note: if you haven't already, make sure you have NodeJS and npm installed, you can verify by typing `node` and `npm` in your terminal.

# Materials

[Day 11: Introduction to NodeJS and ExpressJS](https://docs.google.com/presentation/d/1AK09Hkiiswz1fMjZ6jTI71yKcpEf_ttS/edit?usp=sharing&ouid=100708582121827169460&rtpof=true&sd=true)

[Day 12: Databases and Firebase Firestore](https://docs.google.com/presentation/d/1lw9Uor3_-Pzt5UIIKQaIj7lmjrCRcj7m/edit?usp=sharing&ouid=100708582121827169460&rtpof=true&sd=true)

<<<<<<< HEAD
# Firebase Tutorial

We will expect you to have a firebase account so you can do your homework this week. To get started with firebase, observe the following steps:

1. Go to firebase.com and sign up with a personal account
2. Create a project
* Click On: Get Started
* Click On: Add Project
* Name the project

3. To use Google Authentication and other Firebase utilities
* Go to Project settings (gear at top left) and under "Your apps" add a web app (</>)
* This will give you code which looks like this
  
```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "<apiKey>",
  authDomain: "<authDomain>",
  projectId: "<projectId>",
  storageBucket: "<storageBucket>",
  messagingSenderId: "<messagingSenderId",
  appId: "<appId"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

* npm install firebase in your frontend
* Copy over the js code given into a firebase.js file preferably located in frontend/src/components/Firebase/firebase.js (you may need to create directories). This will be used to initialize Firebase on the frontend to facilitate Google Authentication, etc.

4. For Firebase Backend Database
* npm install firebase in your backend
* Copy over the following code (this code can also be found in project settings, the gear on the top left > service accounts > Firebase Admin SDK) into backend/firebase/cred.js (you may need to create directories)
  
```
const firebase = require("firebase-admin");
const credentials = require("./cred.json");

firebase.initializeApp({
  credential: firebase.credential.cert(credentials)
});

module.exports = firebase;
```
* Create the cred.json, in backend/firebase/cred.json. This json can be found through project settings (gear on top left) > service accounts > manage service account permissions > three dots next to firebase-adminsdk-... > manage keys > add key > create new key > json, and then copy over the json that is given into the cred.json file
* This cred.json is used by the cred.js file to establish your credentials as an administrator who can interact with the Firebase database for your particular project. Do not share this json with anyone you don't trust, and be sure to add \*\*/cred.json to your .gitignore


=======
>>>>>>> upstream/main
# Demo

We will go over how to create basic endpoints + middleware with express

We will also go over how to connect to Firebase and use cloud firestore to model a Twitter like application, demonstrating how document databases handle one-one, one-many, many-many relationships.

# Homework

For this week's homework, you will be working with firebase and expressJS to build out the TODO application's backend section including routes to:

<<<<<<< HEAD
1. Create a todo object
2. List all todo's for a user
3. Delete/Check off a todo object

You do not have to handle authentication and authorization, we will get there in Week 7, nor hosting, which will be handled in Week 9. You will also need a frontend, which you can take from your Week 5 homework. Host your application on localhost:4000, and your React application on localhost:3000. Make sure they are connected, and don't worry about login/logout routes for now.

PS: if you run into any CORS errors, please run `npm install cors` and follow the instructions on setting up [here](https://www.npmjs.com/package/cors)
=======
1. Get all todo's for a user
2. Create a todo object
3. Delete/Check off a todo object

You do not have to handle authentication and authorization, we will get there in Week 7, nor hosting, which will be handled later. You will also need a frontend, which you can take from your Week 5 homework. Host your backend application on localhost:3001, and your React application on localhost:3000. Make sure they are connected, and don't worry about login/logout routes for now.

PS: if you run into any CORS errors, please run `npm install cors` and follow the instructions on setting up [here](https://www.npmjs.com/package/cors)

### Setting Up Firebase for Your Express Project

In this part of the course, you'll be setting up Firebase to build the backend for a simple TODO app. Follow the steps below to get Firebase configured in your Express project. Ensure you have a Firebase account to proceed.

1. **Creating a Firebase Project:**
   - Visit [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
   - Click on “Add project”.
   - Fill in your Project name and follow the on-screen instructions to create the project.

2. **Understanding the Firebase Console:**
   - Once your project is set up, this is how your database might look in the Firebase console. If you want to have the least amount of changes on your frontend, try to make your database as similar to our solution in the screenshot below:
     
     <img src="https://i.ibb.co/TWVqcVv/Database-Snapshot.png"/>
     
     In this sample view of the Firebase console, there's a `tasks` collection. Within this collection, multiple documents are stored - each one is a task. Each document has a unique identifier provided by Firebase (e.g., `2ROsa7Sm4Yt3f05DVRp4`). Inside these documents, there are fields with specific data associated with them. In our API's implementation, a document has the following fields:
     - `finished`: Indicates whether the task is completed or not. It's a boolean value (`true` or `false`).
     - `task`: The actual description or name of the task (e.g., "clean the room").
     - `user`: The name of the user assigned to or responsible for the task (e.g., "vincent").


3. **Setting Up Firebase SDK:**
   - Once your project is created, go to Project settings (gear icon at the top left).
   - Under the "General" tab, scroll down to "Your apps" section and click on the web icon (`</>`).
   - Register your app by providing an app nickname.
   - You will now see a configuration object.

4. **Configuring Firebase in Your Backend:**
   - A package.json file has already been provided that includes firebase-admin. Run: 
     ```bash
     npm install
     ```
   - Navigate to Project settings > Service accounts tab in Firebase console.
   - Click on “Generate new private key”. This will download a `.json` file containing your service account credentials.
   - Move this `.json` file to your project directory and rename it to `cred.json`.
   - In your `firebase.js` file, make sure the following code looks similar:
     ```javascript
     const admin = require('firebase-admin');
     const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS);

     admin.initializeApp({
       credential: admin.credential.cert(creds)
       databaseURL: "https://your-database-url.firebaseio.com"
     });

     const app = express();
     ```

5. **Building Your API:**
   - Now you can start building your Express routes and middleware to interact with Firebase services like Firestore, Firebase Auth, etc.

   - For your convenience, we have provided you with a starter endpoint to retrieve all tasks! (though you shouldn't be calling this endpoint in your finished solution.)

   - Hint! 🚀 When you're adding a task to Firebase Firestore, the database will automatically create a new document for the task and assign it a unique ID. You don't have to worry about manually generating this ID!

   - Here's a little snippet to guide you on how you can get this ID after adding a task to the database:

   ```javascript
   const addedTask = await db.collection("tasks").add(data);
    res.status(201).send({
      id: addedTask.id,  // Automatically generated Document ID from Firestore
      ...data,
    });
   ```

   - Make sure to use this ID in your responses to the caller. It'll be crucial when you're performing operations like updating or deleting specific tasks. Good luck!
>>>>>>> upstream/main
