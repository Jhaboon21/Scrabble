"use strict";

const Letters = require("./letters");

/** Class for pool of letters. */

class LetterPool {
    constructor(size) {
        this.size = size;
        this.pool = [];
        this.initPool();
    }

    initPool() {
        for (let i = 0 ; i < this.size; i++) {
            this.pool.push(new Letters());
        }
    }

    getLetters() {
        if (this.pool.length > 0) {
            return this.pool.pop();
        } else {
            return null;
        }
    }

    returnLetters(letters) {
        if (this.pool.length < this.size) {
            this.pool.push(letters);
        }
    }
}

module.exports = LetterPool;