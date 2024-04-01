import React, { useContext} from "react";
import UserContext from "../auth/UserContext";
import ScrabbleAPI from "../../api/api";
import buildBoard from "./Board";

/** Game logic
 * determine whose turn it is and when they can play letters
 * tally points and give to player
 */
function GameLogic(player1, player2) {
    const {currentUser} = useContext(UserContext);

    let board = null;
    let boardLetters = [];
    let lettersToBePlayed = [];

    let currentTurn = player1;
    let player1Letters = [];
    let player2Letters = [];
    let dictionary = [];

    if (currentTurn != currentUser) return //Not Your Turn!

    // check if the word is valid, then tally points and give to player
    // async function checkWord(await ScrabbleAPI.validateWord(word))
    // if valid, currentUser.points += tallypoints

    buildBoard();

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