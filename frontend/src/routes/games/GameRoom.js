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
    const [currentTurn, setCurrentTurn] = useState("")

    // let board = null;
    let boardLetters = [];
    let lettersToBePlayed = [];

    //let currentTurn = game.player1;
    // let player1Letters = [];
    // let player2Letters = [];
    let totalLetters = [
        "A","A","A","A","A","A","A","A","A",
        "B","B",
        "C","C",
        "D","D","D","D",
        "E","E","E","E","E","E","E","E","E","E","E","E",
        "F","F",
        "G","G","G",
        "H","H",
        "I","I","I","I","I","I","I","I","I",
        "J",
        "K",
        "L","L","L","L",
        "M","M",
        "N","N","N","N","N","N",
        "O","O","O","O","O","O","O","O",
        "P","P",
        "Q",
        "R","R","R","R","R","R",
        "S","S","S","S",
        "T","T","T","T","T","T",
        "U","U","U","U",
        "V","V",
        "W","W",
        "X",
        "Y","Y",
        "Z"
    ];

    

    // shuffle the "bag of letters" 
    function shuffle(array) {
        let currentIndex = array.length;

        while (currentIndex !== 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    }
    

    // then distribute letters to players. 
    // This should happen at the beginning of a player's every turn.
    function drawLetters(arr) {
        while (arr.length < 7 && totalLetters.length > 0) {
            let i = 7 - arr.length;
            arr = totalLetters.splice(0,i)
        }
        console.log(arr);
    }

    // display a player's letters
    function displayLetters(arr) {
        console.log("displaying letters!");
        console.log(arr);
        // document.addEventListener("DOMContentLoaded", function() {
        //     for (let i = 0; i < arr.length; i++) {
        //     let tile = document.createElement("li").setAttribute("class", "tiles");
        //     console.log(arr[i] + i);
        //     tile.innerText = arr[i];
        //     document.getElementById("player_letters").appendChild(tile);
        // }});

        for (let i = 0; i < arr.length; i++) {
            let tile = document.createElement("li").setAttribute("class", "tiles");
            console.log(arr[i] + i);
            tile.innerText = arr[i];
            document.getElementById("player_letters").appendChild(tile);
        }
    }


    // check if the word is valid, then tally points and give to player
    // async function checkWord(await ScrabbleAPI.validateWord(word))
    // if valid, currentUser.points += tallypoints

    // determine what words are valid and calculate points
    async function findWordsAndPoints() {
        let words = [];
        let pointSum = 0;

        for (let i = 0; i < lettersToBePlayed.length; i++) {
            let cur = lettersToBePlayed[i];

            // horizontal words
            let h = cur;
            while (boardLetters[h-1] !== "" && (h%15) > 0) {
                h -= 1;
            }
            let word = boardLetters[h];
            //let points = pointsPerLetter[boardLetters[h]];
            h++;
            while (boardLetters[h] !== "" && (h%15) !== 0) {
                word = word.concat(boardLetters[h]);
                //points += pointsPerLetter[boardLetters[h]];
                h += 1;
            }
            if (word.length > 1 && words.indexOf(word) === -1) {
                words.push(word);
                //pointSum += points;
                pointSum += await ScrabbleAPI.scrabbleScore(word);
            }

            // vertical words
            let v = cur;
            while (boardLetters[v-15] !== "" && v > 14) {
                v -= 15;
            }
            word = "";
            //points = 0;
            while (boardLetters[v] !== "" && v < 225) {
                word = word.concat(boardLetters[v]);
                //points += pointsPerLetter[boardLetters[v]];
                v += 15;
            }
            if (word.length > 1 && words.indexOf(word) === -1) {
                words.push(word);
                //pointSum += points;
                pointSum += await ScrabbleAPI.scrabbleScore(word);
            }
        }
        return [words, pointSum];
    }


    function handleTurn(e) {
        e.preventDefault();
        console.log("You've submitted your turn!")

        //findWordsAndPoints();
        
        if (currentTurn !== currentUser.username) return; //Not Your Turn!
        else if (currentTurn === game.player1) {
            console.log("current turn is player1, now switching to 2");
            // drawLetters(player1Letters);
            setCurrentTurn(game.player2);
            console.log("new turn started: " + currentTurn)
        }
        else if (currentTurn === game.player2) {
            console.log("current turn is player2, now switching to 1");
            // drawLetters(player2Letters);
            setCurrentTurn(game.player1);
            console.log("new turn started: " + currentTurn)
        } 

    }

    function handlePass(e) {
        e.preventDefault();
        console.log("you passed your turn.");
        if (currentTurn === game.player1) {
            setCurrentTurn(game.player2);
            console.log("new turn started: " + currentTurn)
        }
        else if (currentTurn === game.player2) {
            setCurrentTurn(game.player1);
            console.log("new turn started: " + currentTurn)
        } 
    }

    useEffect(function loadGameRoom() {
        async function getGameRoom() {
            let game = await ScrabbleAPI.getGameRoom(handle);
            setCurrentTurn(game.player1);
            console.log("current turn has been set");
            console.log(game);
            setGame(game);
            BuildBoard();

            // shuffle(totalLetters);
            // console.log("shuffling");
            // console.log(totalLetters);

            // drawLetters(player1Letters);
            // console.log("now drawing player2's");
            // drawLetters(player2Letters);

        }
        getGameRoom();
    }, [handle]);

    // while waiting for game to load, display loading spinner
    if (!game) return <LoadingSpinner />;

    //if (currentTurn !== currentUser) return //Not Your Turn!

    return (
        <div className="GameRoom">
            {game.game.player2 === null  
            ? <div> Here is the invite code: {handle} </div>
            : <div> Let's Play! It is currently {currentTurn}'s turn!</div>
            }
            <div className="game">
                <div className="gameBoard">

                </div>

                <div className="letter_container">
                    <div id="your_letters">Your Letters</div>
                    <div id="player_letters">
                        {(currentUser.username == game.game.player1) ? displayLetters(game.player1Letters) : displayLetters(game.player2Letters)}
                    </div>
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
                    
                    <div className="letters_left"><span id="letters_left">Total Letters Left: <b>{totalLetters.length}</b></span></div>
                </div>
            </div>
        </div>
    )
}

export default GameRoom;