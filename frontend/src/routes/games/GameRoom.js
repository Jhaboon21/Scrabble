import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ScrabbleAPI from "../../api/api";
import UserContext from "../auth/UserContext";
import LoadingSpinner from "../../common/LoadingSpinner";
import BuildBoard from "../../game/Board";
// import Logic from "../../game/Logic";
import './GameRoom.css';

/** Show the game room and board
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
    const [grid, setGrid] = useState(buildBoard());
    const [ws, setWs] = useState(null);

    //const socket = new WebSocket('ws://localhost:3001');

    // display the player's letters
    function displayLetters(arr) {
        return (
            <ul className="player_letters">
                {arr.map((val, index) => <li className="tiles" key={index} onClick={handleTile} value={val}>{val}</li>)}
            </ul>
        )
    }
    // build the game board
    function buildBoard() {
        const rows = [];
        for (let row = 0; row < 15; row++) {
            const boxes = [];
            for (let col = 0; col < 15; col++) {
                boxes.push({
                    row,
                    col,
                    letter: '',
                });
            }
            rows.push(boxes);
        }
        return rows;
    }

    // traverse through grid to form words... need to work on this to traverse based on the words placed
    const findWords = (grid) => {
        const numRows = grid.length;
        const numCols = grid[0].length;
        const words = [];

        for (let i = 0; i < numRows; i++) {
            let currentWord = '';
            for (let j = 0; j < numCols; j++) {
                // If the current tile is not empty, add its letter to the currentWord
                if (grid[i][j].letter !== '') {
                    currentWord += grid[i][j].letter;
                } else {
                    // If the word has at least 2 letters, add to the list of words
                    if (currentWord.length > 1) {
                        words.push(currentWord.toLowerCase());
                    }
                    currentWord = ''; // Reset the current word for the next sequence
                }
            }
            // If at the last tile of the row, add word if not empty.
            if (currentWord.length > 1) {
                words.push(currentWord.toLowerCase());
            }
        }
        console.log(words)
        return words;
    };

    async function getPoints(arr) {
        let score = 0;
        for (let i = 0; i < arr.length; i++) {
            let res = await ScrabbleAPI.scrabbleScore(arr[i]);
            if (res.statusCode === 200) {
                console.log(res.value)
                score += res.value;
            }
        }
        console.log(score);
        // update the backend
        if (currentTurn === game.game.player1) {
            game.game.player1score += score;
        } else {
            game.game.player2score += score;
        }
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
                //console.log(boardTile); // this can be later saved/used to string together letters
                boardTile.innerHTML = activeTile

                let ele = document.querySelector('.tiles.selected');
                ele.classList.toggle('selected')    // make it unselected
                // then get the game.player1Letters that match the value and remove

                if (currentTurn === game.game.player1) {
                    let index = playerLetters.indexOf(ele.innerHTML);
                    if (index > -1) playerLetters.splice(index, 1);
                }

                const newGrid = [...grid]
                newGrid[boardTile.dataset.row][boardTile.dataset.col].letter = activeTile;
                setGrid(newGrid);
                setActiveTile(null);
            }
            // else if spot has a tile that was placed on this turn, or if spot alread has a tile, return for now*
            else {
                console.log("there is something here already."); // COME BACK and add more functionality later. *return the tile or switch tiles. or make it so you can't click on finished tiles
                return;
            }
        }
    }

    // pressing the 'Submit Turn' button will verify and solidify the played letters and switch to next player's turn
    async function handleTurn(e) {
        e.preventDefault();        
        if (currentTurn !== currentUser.username) return; //Not Your Turn!

        console.log("You've submitted your turn!")

        let letters = await ScrabbleAPI.drawLetters(handle, 7 - playerLetters.length);
        setPlayerLetters(l => [...l, ...letters.cards])

        //getPoints(findWords(grid));
        console.log('sending message!');
        console.log(JSON.stringify(grid));
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(grid));
            console.log('message has been sent!')
        } else {
            console.error('WebSocket is not open.')
        }
        
        


        
        if (currentTurn === game.game.player1) {
            console.log("current turn is player1, now switching to 2");
            setCurrentTurn(game.game.player2);
            console.log("new turn started: " + currentTurn)
        }
        else if (currentTurn === game.game.player2) {
            console.log("current turn is player2, now switching to 1");
            setCurrentTurn(game.game.player1);
            console.log("new turn started: " + currentTurn)
        }

    }

    // This should remove any played letters in this turn, and change the current turn to the other player.
    function handlePass(e) {
        e.preventDefault();
        console.log("you passed your turn.");
        if (currentTurn === game.game.player1) {
            setCurrentTurn(game.game.player2);
            console.log("new turn started: " + currentTurn)
        }
        else if (currentTurn === game.game.player2) {
            setCurrentTurn(game.game.player1);
            console.log("new turn started: " + currentTurn)
        }
    }

    const handleWebSocketMessage = (message) => {
        console.log('another user submitted a turn, here is the socket update.')
        console.log(message);
        setGrid(message);
    }

    // load room and it's data, set player turn and letters
    useEffect(function loadGameRoom() {
        async function getGameRoom() {
            const game = await ScrabbleAPI.getGameRoom(handle);
            let letters = await ScrabbleAPI.drawLetters(handle, 7) // draw 7 letters
            setCurrentTurn(game.game.player1);
            setPlayerLetters(letters.cards);
            console.log(game);
            setGame(game);
            //BuildBoard();
        }
        getGameRoom();        
    }, [handle]);

    // separate useEffect for the WebSockets
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3001');

        socket.onopen = () => {
            console.log('Connected to websocket');
            setWs(socket);
        };
        socket.onmessage = (message) => {
            // Handle messages from the server
            console.log('got a message')
            const data = JSON.parse(message.data);
            handleWebSocketMessage(data);
        };
        socket.onclose = () => {
            console.log('Connection closed');
        };
        return () => socket.close();
    }, []);

    // while waiting for game to load, display loading spinner
    if (!game) return <LoadingSpinner />;

    return (
        <div className="GameRoom">
            {game.game.player2 === null
                ? <div> Here is the invite code: {handle} </div>
                : <div> Let's Play! It is currently {currentTurn}'s turn!</div>
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
                </div>


                <div className="score_container">
                    <h3>SCORE</h3>
                    <div className="player_score_container">
                        <div className="player_name">{game.game.player1} (Player 1)</div>
                        <div className="player_1_points">{game.game.player1score}</div>
                    </div>
                    <div className="player_score_container">
                        <div className="player_name">{game.game.player2 == null ? ("Waiting for Player") : game.game.player2} (Player 2)</div>
                        <div className="player_2_points">{game.game.player2score}</div>
                    </div>

                    {/* <div className="letters_left"><span id="letters_left">Total Letters Left: <b>{game.pool.length}</b></span></div> */}
                </div>
            </div>
        </div>
    )
}

export default GameRoom;