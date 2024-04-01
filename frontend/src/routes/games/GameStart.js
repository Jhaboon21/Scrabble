

/** This will be the lobby where player 1 will wait in
 * 
 * A code/invite/handle should be created for the game room.
 * Once player 2 enters in the code and joins, both will be moved to game room.
 */
function GameStart() {
    
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await createGame();
            
        } catch (err) {

        }
    }

    return (
        <div>
            <div className="game">
                <table id="board">

                </table>

                <div id="your_letters"></div>
                <div id="player1_letters"></div>

                <button id="move" className="button" title="set_letters" onClick={handleTurn}></button>
                <button id="pass" className="button" onClick={handlePass}></button>

                <div className="score_container">
                    <div className="player_name">Player 1: </div><div className="player_1_points">0</div>
                    <div className="player_name">Player 2: </div><div className="player_2_points">0</div>
                    <div className="letters_left"><span id="letters_left"></span></div>
                </div>

            </div>
        </div>
    )
}