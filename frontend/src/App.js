import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import LoadingSpinner from "./common/LoadingSpinner";
import ScrabbleAPI from "./api/api";
import UserContext from "./routes/auth/UserContext";
import Navigation from "./routes/navigation/NavBar";
import RouteList from "./routes/navigation/Routes";
import jwt from "jsonwebtoken";
import './App.css';

export const TOKEN_STORAGE_ID = "scrabble-token";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  useEffect(function loadUserInfo() {
    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          ScrabbleAPI.token = token;

          let currUser = await ScrabbleAPI.getCurrentUser(username);
          setCurrUser(currUser);
        } catch (err) {
          console.error("problem loading user info", err);
          setCurrUser(null);
        }
      }
      setIsLoaded(true);
    }

    // isLoaded is set to false while getCurrentUser is running
    setIsLoaded(false);
    getCurrentUser();
  }, [token]);

  // Handle site-wide logout
  function logout() {
    setCurrUser(null);
    setToken(null);
    ScrabbleAPI.token = null;
  }

  // Handle site-wide signup
  async function signup(signupData) {
    try {
      let token = await ScrabbleAPI.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("signup failed", err);
      return { success: false, err };
    }
  }

  // Handle site-wide login
  async function login(loginData) {
    try {
      let token = await ScrabbleAPI.login(loginData);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("login failed", err);
      return { success: false, err };
    }
  }

  async function joinRoom(handle, user, data) {
    try {
      let token = await ScrabbleAPI.joinRoom(handle, user, data);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("Join Room failed", err);
      return { success: false, err };
    }
  }

  async function createGame(handle, user, data) {
    try {
      let token = await ScrabbleAPI.createGame(handle, user, data);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("Create Room failed", err);
      return { success: false, err };
    }
  }

  // while fetching data, display the loading page
  if (!isLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{ currentUser: currUser, setCurrUser }}>
        <div className="App">
          <Navigation logout={logout} />
          <RouteList login={login} signup={signup} joinRoom={joinRoom} createGame={createGame} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
