import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../auth/UserContext";
import {v4 as uuid} from "uuid";
import Alert from "../../common/Alert";
import "./Homepage.css";

function Homepage({joinRoom, createGame}) {
    const { currentUser } = useContext(UserContext);
    const [formErrors, setFormErrors] = useState([]);
    const [formData, setFormData] = useState({
      handle: "",
      player1: "",
      player1Score: 0,
      player2: null,
      player2Score: 0
    });
    const navigate = useNavigate();

    async function handleSubmit(e) {
      e.preventDefault();
      try {
        // join a game using the handle and add the current user to player2 slot
        await joinRoom(formData.handle, currentUser.username);  
        navigate(`/game/${formData.handle}`);
      } catch (err) {
        setFormErrors(err);
      }
    }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  async function handleCreateGame(e) {
    e.preventDefault();
    // Get the first 8 characters of a new id.
    const unique_id = uuid().slice(0,8);
    formData.handle = unique_id;
    formData.player1 = currentUser.username;
    try {
      // create a new game using the uuid and make current user the player1
      await createGame(unique_id, currentUser.username, formData)
      navigate(`/game/${unique_id}`);
    } catch (err) {
      setFormErrors(err);
    }

  }

  return ( 
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 font-weight-bold">Let's Play Scrabble!</h1>
        {currentUser
            ? (
            <div>
              <h2>Welcome Back, {currentUser.firstName || currentUser.username}!</h2>
              <button
                className="btn btn-danger font-weight-bold text-uppercase float-right"
                onClick={handleCreateGame}
              >
                Start a Game!
              </button>
              <form onSubmit={handleSubmit}>
                <label>Enter Invite Code</label>
                <input 
                  name="handle"
                  className="form-control"
                  value={formData.handle}
                  onChange={handleChange}
                />
                {formErrors.length
                  ? <Alert type="danger" messages={formErrors} />
                  : null
                }
                <button
                    className="btn btn-primary float-right"
                    onSubmit={handleSubmit}
                >
                  Join Game
                </button>
              </form>
              
            </div>
            )
            : (
                <p>
                  <Link className="btn btn-primary font-weight-bold mr-3"
                        to="/login">
                    Log in
                  </Link>
                  <Link className="btn btn-primary font-weight-bold"
                        to="/signup">
                    Sign up
                  </Link>
                </p>
            )}
      </div>
    </div>
  )
}

export default Homepage;