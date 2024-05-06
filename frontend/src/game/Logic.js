import ScrabbleAPI from "../api/api";

// Traverse through grid to form words based on the words placed
function findWords(grid, playedLetters) {
    // Sort the played letters by row and column to ensure they are in order
    playedLetters.sort((a, b) => a.row - b.row || a.col - b.col);

    // Helper function to search for words horizontally
    const searchHorizontal = (row, col) => {
        let word = '';

        // Search left from current position
        for (let i = Number(col); i >= 0 && grid[row][i].letter !== ''; i--) {
            word = grid[row][i].letter + word;
        }

        // Search left from current position
        for (let i = Number(col) + 1; i < grid[row].length && grid[row][i].letter !== ''; i++) {
            word += grid[row][i].letter;
        }

        return word;
    }

    // Helper function to search for words vertically
    const searchVertical = (row, col) => {
        let word = '';

        // Search up from current position
        for (let i = Number(row); i >= 0 && grid[i][col].letter !== ''; i--) {
            word = grid[i][col].letter + word;
        }

        // Search down from current position
        for (let j = Number(row) + 1; j < grid.length && grid[j][col].letter !== ''; j++) {
            word += grid[j][col].letter;
        }
        return word;
    }
    const words = [];

    // Check horizontally and vertically
    playedLetters.forEach(({ row, col }) => {
        const hWords = searchHorizontal(row, col);
        const vWords = searchVertical(row, col);

        // if the words are longer than 1 letter and not already pushed into list of words, push into list of words.
        if (hWords !== '' && hWords.length > 1 && !words.includes(hWords.toLowerCase())) {
            words.push(hWords.toLowerCase());
        }
        if (vWords !== '' && vWords.length > 1 && !words.includes(vWords.toLowerCase())) {
            words.push(vWords.toLowerCase());
        }
    })
    return words;
}

// Handle validating the word and getting the points from the api for the word.
async function getPoints(arr) {
    if (arr.length === 0) throw new Error(`You must place at least 2 letters and form a word.`);
    let score = 0;
    for (let i = 0; i < arr.length; i++) {
        try {
            let res = await ScrabbleAPI.scrabbleScore(arr[i]);
            score += res.data.value;
        } catch (error) {
            throw new Error(`The word ${arr[i]} is not valid.`);
        }
    }
    return score;
}

// The game is finished so we should declare the winner and hide the turn buttons.
function winner(msg) {
    if (msg === 'tie') {
        alert('It is a tie!');
        let ele = document.querySelectorAll('.player_score_container');
        ele.forEach(e => e.classList.toggle('winner'));
    } else {
        alert(`The winner is: ${msg}!!!`);
        let ele = document.querySelector(`#${msg}`);
        ele.classList.toggle('winner');
    }

    let turnEle = document.querySelector('.turn_container');
    turnEle.classList.toggle('hidden')
}

export {findWords, getPoints, winner};