import React, { useContext} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import UserContext from "../auth/UserContext";
import ProfileForm from "../profiles/ProfileForm";
import GameRoom from "../games/GameRoom";

/** List of Routes */
function RouteList({ login, signup }) {
    const {currentUser} = useContext(UserContext);
    return (
        <div>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginForm login={login} />} />
                <Route path="/signup" element={<SignupForm signup={signup} />} />
                
                <Route path="/game/:handle" element={currentUser ? <GameRoom /> : <Navigate to="/login" />} />

                <Route path="/profile" element={currentUser ? <ProfileForm /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    )
}

export default RouteList;