import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../auth/UserContext";
import {v4 as uuid} from "uuid";
import Alert from "../../common/Alert";
import "./Homepage.css";

function Homepage({login}) {
    const { currentUser } = useContext(UserContext);
    const [formErrors, setFormErrors] = useState([]);
    const [formData, setFormData] = useState({
      invite: ""
    });
    const navigate = useNavigate();

    async function handleSubmit(e) {
      e.preventDefault();
      try {
        await login(formData);  
        navigate("/game")
      } catch (err) {
        setFormErrors(err);
      }
    }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  function handleCreateGame(e) {
    //Start a game!
    // on click, check if ...
    // create a unique code/handle for the room
    // create a gameroom in the database
    // add this current player as player1 and 
    


    // Get the first 8 characters of a new id.
    const unique_id = uuid().slice(0,8);

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
                  name="invite"
                  className="form-control"
                  value={formData.invite}
                  onChange={handleChange}
                />
                {formErrors.length
                  ? <Alert type="danger" messages={formErrors} />
                  : null
                }
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