

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
            
        }
    }
}