import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useWebSocket, useWebSocketMessage } from "../../hooks/useWebSocket";
import ScrabbleAPI from "../../api/api";
import UserContext from "../auth/UserContext";
import LoadingSpinner from "../../common/LoadingSpinner";
import BuildBoard from "../../game/Board";
import { findWords, getPoints, winner } from "../../game/Logic";
import './GameRoom.css';

/** Show the game game and board
 * 
 * routed at /game/:handle
 */
function GameRoom() {
    const { handle } = useParams();
    const { currentUser } = useContext(UserContext);
    const [game, setGame] = useState(null);
    const [currentTurn, setCurrentTurn] = useState(null);
    const [activeTile, setActiveTile] = useState(null);
    const [playerLetters, setPlayerLetters] = useState([]);
    const [placedLetters, setPlacedLetters] = useState([]);
    const [lettersLeft, setLettersLeft] = useState(null);
    const [grid, setGrid] = useState(BuildBoard());
    const ws = useWebSocket('wss://scrabble-backend-vqax.onrender.com')
    const [gameState, setGameState] = useState(true); // true is active, false is game over.

    // display the player's letters
    function displayLetters(arr) {
        return (
            <ul className="player_letters">
                {arr.map((val, index) => <li className="tiles" key={index} onClick={handleTile} value={val}>{val}</li>)}
            </ul>
        )
    }

    // display the status of the second player
    function displayPlayer2() {
        if (game.player2 === null) {
            return 'Waiting for Player';
        } else return game.player2;
    }

    // handles what happens when a player clicks on a playable letter
    function handleTile(e) {
        e.preventDefault();
        const tile = e.target;

        // if there is currently an active tile selected
        if (activeTile !== null) {
            setActiveTile(null);                                                // reset tile and in the case where the same/different tile was selected
            let childrenArr = Array.from(tile.parentNode.children);             // select the parent and gather all children to convert into array
            childrenArr.forEach(child => child.classList.remove('selected'));   // loop through array and remove the className 'selected'
        } else {
            setActiveTile(tile.innerHTML);
            tile.classList.toggle('selected')
        }
    }

    // handle placing a tile on the game board
    function handlePlaceTile(e) {
        e.preventDefault();
        const boardTile = e.target;
        // if no tile currently selected or not currently their turn, do nothing
        if (activeTile === null || currentTurn !== currentUser.username) return;

        // a tile is selected. place into board
        if (activeTile !== null) {
            // if the spot on the board is empty, put tile inside
            if (boardTile.innerHTML === "") {
                boardTile.classList.toggle('active')
                boardTile.innerHTML = activeTile

                let ele = document.querySelector('.tiles.selected');
                ele.classList.toggle('selected')    // make it unselected

                // Remove the letter from the player's hand
                let index = playerLetters.indexOf(ele.innerHTML);
                if (index > -1) {
                    playerLetters.splice(index, 1);
                }

                const newGrid = [...grid]
                newGrid[boardTile.dataset.row][boardTile.dataset.col].letter = activeTile;
                setGrid(newGrid);
                setPlacedLetters([...placedLetters, { row: boardTile.dataset.row, col: boardTile.dataset.col }])
                setActiveTile(null);
            }
            // else if spot has a tile that was placed on this turn, or if spot alread has a tile, return for now*
            else {
                console.log("there is something here already.");                        // COME BACK and add more functionality later. *return the tile or switch tiles. or make it so you can't click on finished tiles
                return;
            }
        }
    }

    // pressing the 'Submit Turn' button will verify and solidify the played letters and switch to next player's turn
    async function handleTurn(e) {
        e.preventDefault();
        if (currentTurn !== currentUser.username) return; //Not Your Turn!

        // use placed letters to findWords. it will return an array of words then get points using that array.
        const words = findWords(grid, placedLetters);

        try {
            // then use those words to try and get the points for them.
            let score = await getPoints(words);
            if (score > 0) {
                // update the backend and update score for both players
                if (currentTurn === game.player1) {
                    let res = await ScrabbleAPI.addPoints(handle, currentTurn, score)
                    ws.send(JSON.stringify({
                        type: 'game',
                        content: res
                    }))
                } else {
                    let res = await ScrabbleAPI.addPoints(handle, currentTurn, score)
                    ws.send(JSON.stringify({
                        type: 'game',
                        content: res
                    }))
                }
            }
        } catch (err) {
            // if words are invalid, remove from grid and add back to player hand.
            const newGrid = [...grid];
            placedLetters.forEach(({ row, col }) => {
                async function putBackLetters() {
                    let element = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    if (element) {
                        element.classList.toggle('active');
                        await setPlayerLetters((l => [...l, grid[row][col].letter]));       // awaiting here to try and get the setState to finish the update before rendering
                        newGrid[row][col].letter = '';
                        await setGrid(newGrid);
                    }
                }
                putBackLetters();
            })
            alert(err.message);
            setPlacedLetters([]);
            return;
        }

        // draw and set letters for the player
        let letters = await ScrabbleAPI.drawLetters(handle, 7 - playerLetters.length);
        setPlayerLetters(l => [...l, ...letters.cards])
        setLettersLeft(letters.num);

        // send msg to backend with grid to update the other player's grid
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'grid',
                content: grid
            }));
        } else {
            console.error('WebSocket is not open.')
        }
        setPlacedLetters([]);
        setTurn(game)
    }

    // This should remove any played letters in this turn, and change the current turn to the other player.
    function handlePass(e) {
        e.preventDefault();

        const newGrid = [...grid];
        placedLetters.forEach(async ({ row, col }) => {
            async function putBackLetters() {
                let element = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (element) {
                    element.classList.toggle('active');
                    await setPlayerLetters(l => [...l, grid[row][col].letter])          // awaiting here to try and get the setState to finish the update before rendering
                    newGrid[row][col].letter = '';
                    await setGrid(newGrid);
                }
            }
            putBackLetters();
        })
        setPlacedLetters([]);
        setTurn(game)
    }

    // handle what happens when pressing the End Game button
    function endGame(e) {
        e.preventDefault();

        // Only the user with the current turn can decide if they want to end the game.
        if (currentTurn === currentUser.username) {
            if (!gameState) { // Current user has received a request to end and has decided to confirm the end. Send another WebSocket message to let both know that it is offically done.          
                let winner = game.player1score > game.player2score
                    ? game.player1
                    : game.player1score < game.player2score
                        ? game.player2
                        : 'tie';

                ws.send(JSON.stringify({
                    type: 'finish',
                    content: winner
                }));
            } else { // No one has requested to end yet, so initial request will be sent to other player.
                setTurn(game)
                ws.send(JSON.stringify({
                    type: 'end',
                    content: 'Received request to end game.'
                }))
            }
        }
    }

    // determine and set the next player's turn.
    const setTurn = (game) => {
        if (currentTurn === game.player1) {
            ws.send(JSON.stringify({
                type: 'turn',
                content: game.player2
            }))
        }
        else if (currentTurn === game.player2) {
            ws.send(JSON.stringify({
                type: 'turn',
                content: game.player1
            }))
        }
    }

    // load game and it's data, set player letters
    useEffect(function loadGameRoom() {
        async function getGameRoom() {
            if (currentUser) {
                try {
                    const game = await ScrabbleAPI.getGameRoom(handle);
                    let letters = await ScrabbleAPI.drawLetters(handle, 7 - playerLetters.length) // draw 7 letters
                    setPlayerLetters(letters.cards);
                    setLettersLeft(letters.num);
                    setGame(game);
                    if (currentUser.username === game.player2) setCurrentTurn(game.player1);
                } catch (err) {
                    console.error("Error fetching game", err);
                }
            }
        }
        getGameRoom();
    }, [currentUser, handle]);

    // Handle the different type of messages that the client might receive from the websocket       
    useWebSocketMessage(ws, async (message) => {
        switch (message.type) {
            case 'system':
                // A user has joined and should update the lobby
                const game = await ScrabbleAPI.getGameRoom(handle);
                setCurrentTurn(game.player1);
                setGame(game);
                break;
            case 'board':
                // a user has submitted a turn, so we should update the board
                setGrid(message.content);
                break;
            case 'turn':
                // also adjust the player turns
                setCurrentTurn(message.content);
                // if player had previously tried to end game, but other person wants to keep going, set gameState to true.
                setGameState(true);
                break;
            case 'game':
                // update the board for both players
                setGame(message.content);
                break;
            case 'end':
                // notify user that other user wants to end the game
                console.log(message.content);
                if (currentTurn === currentUser.username) {
                    alert('Other player is requesting to end the game.');           // this alert doesn't happen because currentTurn/user is undefined. maybe need to pass the turn/user in the message.content
                }
                setGameState(false);
                break;
            case 'finish':
                // Both users have confirmed to end the game.
                console.log(message.content);
                setPlayerLetters([])
                winner(message.content);
                break;
        }
    });

    // while waiting for game to load, display loading spinner
    if (!game) return <LoadingSpinner />;

    return (
        <div className="GameRoom">
            {game.player2 === null
                ? <div> Here is the invite code: {handle} </div>
                : gameState === true
                    ? <div> Let's Play! It is currently <b>{currentTurn}'s</b> turn!</div>
                    : <div> The other player is asking to End the game. Select '<b>End Game</b>' to confirm the end or continue to place letters and '<b>Submit Turn</b>' to continue playing. </div>
            }
            <div className="gameBoard">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((box) => (
                            <div
                                key={`${box.row}-${box.col}`}
                                className="box"
                                data-row={box.row}
                                data-col={box.col}
                                onClick={handlePlaceTile}
                            >
                                {box.letter}
                            </div>
                        ))}
                    </div>
                ))}

                <div className="letter_container">
                    <div id="your_letters">Your Letters</div>
                    {displayLetters(playerLetters)}
                </div>


                <div className="turn_container">
                    <button id="move" className="turn_button" title="set_letters" onClick={handleTurn}>Submit Turn</button>
                    <button id="pass" className="turn_button" onClick={handlePass}>Pass Turn</button>
                    <button id="end" className="turn_button" onClick={endGame}>End Game</button>
                </div>


                <div className="score_container">
                    <h3>SCORE</h3>
                    <div className="player_score_container p1" id={game.player1}>
                        <div className="player_name">{game.player1} (Player 1)</div>
                        <div className="player_1_points">{game.player1score}</div>
                    </div>
                    <div className="player_score_container p2" id={game.player2}>
                        <div className="player_name">{displayPlayer2()} (Player 2)</div>
                        <div className="player_2_points">{game.player2score}</div>
                    </div>

                    <div className="letters_left"><span id="letters_left">Total Letters Left: <b>{lettersLeft}</b></span></div>
                </div>
            </div>
        </div>
    )
}

export default GameRoom;
