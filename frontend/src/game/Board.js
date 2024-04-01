import $ from 'jquery';
import './Board.css'

/** 
 * Create the 15x15 game board
 */

function buildBoard() {
    // should maybe try to not nest this for loop
    for (let row = 0; row < 15; row++) {
        let newRow = $('<div class="row"></div>'); // each row
        for (let col = 0; col < 15; col++) { 
            let newBox = $('<div class="box"></div>') // each column/box inside the row
            newBox.attr("data-row", row);
            newBox.attr("data-col", col); // set attribute for the row and columns
            newRow.append(newBox); // add the box to the row container
        }
        $('.gameBoard').append(newRow);
    }
}

export default buildBoard;