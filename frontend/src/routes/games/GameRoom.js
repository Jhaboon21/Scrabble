import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ScrabbleAPI from "../../api/api";
import UserContext from "../auth/UserContext";
import LoadingSpinner from "../../common/LoadingSpinner";
import BuildBoard from "../../game/Board";
import './GameRoom.css';

/** Show the game room and board
 * 
 * routed at /game/:handle
 */
function GameRoom() {
    const { handle } = useParams();
    const { currentUser } = useContext(UserContext);
    const [game, setGame] = useState(null);



    function handleTurn(e) {
        console.log("You've submitted your turn!")
    }

    function handlePass(e) {
        console.log("you passed your turn.");
    }

    useEffect(function loadGameRoom() {
        async function getGameRoom() {
            let game = await ScrabbleAPI.getGameRoom(handle);
            setGame(game);
            BuildBoard();
        }
        getGameRoom();
    }, [handle]);


    // while waiting for game to load, display loading spinner
    if (!game) return <LoadingSpinner />;

    //buildBoard();

    return (
        <div className="GameRoom">
            <div className="game">
                <div className="gameBoard">

                </div>

                <div id="your_letters">Your Letters</div>
                <div id="player1_letters"></div>

                <button id="move" className="button" title="set_letters" onClick={handleTurn}>Submit Turn</button>
                <button id="pass" className="button" onClick={handlePass}>Pass Turn</button>

                <div className="score_container">
                    <h3>SCORE</h3>
                    <div className="player_name">(Player 1): </div><div className="player_1_points">0</div>
                    <div className="player_name">Player 2: </div><div className="player_2_points">0</div>
                    <div className="letters_left"><span id="letters_left"></span></div>
                </div>

            </div>
        </div>
    )
}

export default GameRoom;