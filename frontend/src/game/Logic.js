import React, { useContext} from "react";
import UserContext from "../routes/auth/UserContext";
import ScrabbleAPI from "../api/api";

/** Game logic
 * determine whose turn it is and when they can play letters
 * tally points and give to player
 */
function Logic(player1, player2) {
    const {currentUser} = useContext(UserContext);

    let board = null;
    let boardLetters = [];
    let lettersToBePlayed = [];

    let currentTurn = player1;
    let player1Letters = [];
    let player2Letters = [];
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

    if (currentTurn != currentUser) return //Not Your Turn!

    // shuffle the "bag of letters" 
    function shuffle(array) {
        let currentIndex = array.length;

        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    }
    shuffle(totalLetters);

    // then distribute letters to players. 
    // This should happen at the beginning of a player's every turn.
    function drawLetters(playerLetters) {
        while (playerLetters.length < 7 && totalLetters > 0) {
            let i = 7 - playerLetters.length;
            playerLetters = totalLetters.splice(0,i)
        }
    }
    // if (currentTurn == player1) drawLetters(player1Letters);
    // if (currentTurn == player2) drawLetters(player2Letters);

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
}

export default Logic;