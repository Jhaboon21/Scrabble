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
    static async create({ handle, player1, player1Score = 0, player2 = "", player2Score = 0 }) {
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
            RETURNING handle, player1, player1Score, player2, player2Score`,
            [handle, player1, player1Score, player2, player2Score]
        );
        const game = result.rows[0];
        return game;
    }

    /** Add player2 to the game
     * 
     * Check if there is no player 2, and check to make sure player1 != player2
     * Update current user into player2
     * 
     * Throws BadRequestError if there's already a player2 or if it's the same as player1
     */
    static async addSecondPlayer(handle, player2) {
        const duplicateCheck = await db.query(
            `SELECT player1
            FROM games
            WHERE handle = $1
            AND player1 = $2`,
            [handle, player2]
        );
        const nullCheck = await db.query(
            `SELECT player2
            FROM games
            WHERE handle = $1
            AND player2 IS NOT NULL`,
            [handle]
        );
        // Check for if "player2" is the same as "player1"
        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate user: ${player2}`);    
        
        // Check for if player2 is null
        if (nullCheck.rows[0]) throw new BadRequestError(`Cannot add user: ${player2}. Another user is in this game.`);       

        const result = await db.query(
            `UPDATE games
            SET player2 = $1
            WHERE handle = $2
            RETURNING handle, player1, player1Score, player2, player2Score`,
            [player2, handle]
        );

        const game = result.rows[0];
        return game;
    }

    /** Update player's score
     * 
     * Add points to the corresponding player
     * 
     * Throws NotFoundError if player not found 
     */
    static async addPoints(handle, player, points) {
        const addPlayer1 = await db.query(
            `SELECT player1Score
            FROM games
            WHERE handle = $1
            AND player1 = $2`,
            [handle, player]
        );
        console.log("first check");
        console.log(addPlayer1);
        console.log("second check with .rows[0]");
        console.log(addPlayer1.rows[0]);
        let newPoints = addPlayer1 + points;
        console.log(newPoints);
        const result = await db.query(
            `UPDATE games
            SET player1Score = $1
            WHERE handle = $2
            RETURNING handle, player1, player1Score, player2, player2Score`,
            [newPoints, handle]
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

    /** Given a game handle, return data about game.
     * 
     * return {handle, player1, player1Score, player2, player2Score}
     * 
     * Throws NotFoundError if not found.
     */
    static async getUserGames(username) {
        const result = await db.query(
            `SELECT handle, player1, player1Score, player2, player2Score
            FROM games
            WHERE player1 = $1`,
            [username]
        );
        const game = result.rows[0];
        if (!game) throw new NotFoundError(`No Games Found: ${username}`);
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