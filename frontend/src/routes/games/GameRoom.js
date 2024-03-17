import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ScrabbleAPI from "../../api/api";
import LoadingSpinner from "../../common/LoadingSpinner";

/** Show the game room and board
 * 
 * routed at /game/:handle
 */
function GameRoom() {
    const {handle} = useParams();
    const [game, setGame] = useState(null);

    useEffect(function getCompanyAndJobs() {
        async function getGameRoom() {
            setGame(await ScrabbleAPI.getGameRoom(handle));
        }
        getGameRoom();
    }, [handle]);

    // while waiting for game to load, display loading spinner
    if (!game) return <LoadingSpinner />;

    return (
        <div className="GameRoom">

        </div>
    )
}

export default GameRoom;