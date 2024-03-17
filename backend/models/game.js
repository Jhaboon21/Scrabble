"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Game {
    /** Create a game room with a unique code
     * 
     * data should be { handle, player1, player1Score, player2, player2Score }
     * 
     * Throws BadRequestError is game is already in database.
     */
    static async create({ handle, player1, player1Score = 0, player2, player2Score = 0 }) {
        const duplicateCheck = await db.query(
            `SELECT handle
            FROM games
            WHERE handle = $1`,
            [handle]
        );

        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate game: ${handle}`);

        const result = await db.query(
            `INSERT INTO games
            (handle, player1, player1Score, player2, player2Score)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING handle, player1, player2`,
            [handle, player1, player1Score, player2, player2Score]
        );
        const game = result.rows[0];
        return game;
    }

    /** Given a game handle, return data about game.
     * 
     * return {handle, player1, player1Score, player2, player2Score}
     * 
     * Throws NotFoundError if not found.
     */
    static async get(handle) {
        const result = await db.query(
            `SELECT handle, player1, player1Score, player2, player2Score
            FROM games
            WHERE handle = $1`,
            [handle]
        );
        const game = result.rows[0];
        if (!game) throw new NotFoundError(`Game not found: ${handle}`);
        return game;
    }

    /** Delete a given game from database; returns undefined
     * 
     * Throws NotFoundError if not found.
     */
    static async remove(handle) {
        const result = await db.query(
            `DELETE
            FROM games
            WHERE handle = $1`,
            [handle]
        );
        const game = result.rows[0]
        if (!game) throw new NotFoundError(`Game not found: ${handle}`);
    }
}

module.exports = Game;