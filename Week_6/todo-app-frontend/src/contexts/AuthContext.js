// Importing necessary hooks and functionalities
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Imports relevant Firebase Authentication functions
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCUbcCmGm97Pli3KP0kp-ulC2RkJrYx1is",
    authDomain: "tpeo-64846.firebaseapp.com",
    projectId: "tpeo-64846",
    storageBucket: "tpeo-64846.appspot.com",
    messagingSenderId: "884684981861",
    appId: "1:884684981861:web:6f7cac8ac552395ba0688c"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Creating a context for authentication. Contexts provide a way to pass data through 
// the component tree without having to pass props down manually at every level.
const AuthContext = createContext();

// This is a custom hook that we'll use to easily access our authentication context from other components.
export const useAuth = () => {
    return useContext(AuthContext);
};

// This is our authentication provider component.
// It uses the context to provide authentication-related data and functions to its children components.
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [loginError, setLoginError] = useState(null);
    
    // Sign up new users
    const register = (email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setCurrentUser(userCredential.user);
            // correct and formal way of getting access token
            userCredential.user.getIdToken().then((accessToken) => {
                console.log(accessToken)
            })
            navigate("/");
        })
        .catch((error) => {
            setLoginError(error.message);
        });
    };
    
    /*const VALID_USERNAME = "rishi"
    const VALID_PASSWORD = "securePassword"*/

    // Sign in existing users
    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setCurrentUser(userCredential.user);
            // this method of retrieving access token also works
            //console.log(userCredential.user.accessToken)
            localStorage.setItem('user', JSON.stringify({email}))
            navigate("/");
        })
        .catch((error) => {
            setLoginError(error.message);
        });
    };

    // Login function that validates the provided username and password.
    /*const login = (username, password) => {
        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            setLoginError()
            setCurrentUser({username})
            localStorage.setItem('user', JSON.stringify({username}))
            navigate("/")
        } else {
            setLoginError("Invalid username or password")
        }
    };*/

    // Sign out users
    const logout = () => {
        auth.signOut().then(() => {
        setCurrentUser(null);
        localStorage.removeItem('user')
        navigate("/login");
        });
    };

    // Logout function to clear user data and redirect to the login page.
    /*const logout = () => {
        setCurrentUser(null)
        localStorage.removeItem('user')
        navigate("/login")
    };*/

    // An object containing our state and functions related to authentication.
    // By using this context, child components can easily access and use these without prop drilling.
    const contextValue = {
        currentUser,
        register,
        login,
        logout,
        loginError
    };

    // The AuthProvider component uses the AuthContext.Provider to wrap its children.
    // This makes the contextValue available to all children and grandchildren.
    // Instead of manually passing down data and functions, components inside this provider can
    // simply use the useAuth() hook to access anything they need.
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}