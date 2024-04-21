"use strict";

/** Class for init letters. */

class Letters {
    constructor() {
        this.letters = [];
        this.initLetters();
    }

    initLetters() {
        const values = [
            "A", "A", "A", "A", "A", "A", "A", "A", "A",
            "B", "B",
            "C", "C",
            "D", "D", "D", "D",
            "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
            "F", "F",
            "G", "G", "G",
            "H", "H",
            "I", "I", "I", "I", "I", "I", "I", "I", "I",
            "J",
            "K",
            "L", "L", "L", "L",
            "M", "M",
            "N", "N", "N", "N", "N", "N",
            "O", "O", "O", "O", "O", "O", "O", "O",
            "P", "P",
            "Q",
            "R", "R", "R", "R", "R", "R",
            "S", "S", "S", "S",
            "T", "T", "T", "T", "T", "T",
            "U", "U", "U", "U",
            "V", "V",
            "W", "W",
            "X",
            "Y", "Y",
            "Z"
        ];
        for (let val of values) {
            this.letters.push(val)
        }
    }

    shuffle() {
        for (let i = 0; i < this.letters.length; i++) {
            const j = Math.floor(Math.random() * (i+1));
            [this.letters[i], this.letters[j]] = [this.letters[j], this.letters[i]]
        }
    }

    drawLetters() {
        if (this.letters.length > 0) {
            return this.letters.pop();
        } else {
            return null; // pool is empty
        }
    }
}

module.exports = Letters;