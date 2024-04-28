import './Board.css'

/** 
 * Create the 15x15 game board
 */

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

export default buildBoard;