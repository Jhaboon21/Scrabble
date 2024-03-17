import React, { useContext} from "react";
import UserContext from "../auth/UserContext";
import ScrabbleAPI from "../../api/api";

/** Game logic
 * determine whose turn it is and when they can play letters
 * tally points and give to player
 */
function GameLogic(player1, player2) {
    const {currentUser} = useContext(UserContext);

    let currentTurn = player1;

    if (currentTurn != currentUser) return //Not Your Turn!

    // check if the word is valid, then tally points and give to player
    // async function checkWord(await ScrabbleAPI.validateWord(word))
    // if valid, currentUser.points += tallypoints

}