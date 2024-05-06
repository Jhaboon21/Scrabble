const db = require("../db");
const Game = require("../models/game");
const { BadRequestError, NotFoundError } = require("../expressError");

const testGame = {
    handle: "testgame",
    player1: "user1",
    player1Score: 0,
    player2: null,
    player2Score: 0,
};

beforeEach(async () => {
    await db.query("BEGIN");;
});

afterEach(async () => {
    await db.query("ROLLBACK");
});

describe("create method", () => {
    it('should create a new game', async () => {
        const createdGame = await Game.create(testGame);
        expect(createdGame).toEqual({
            handle: "testgame",
            player1: 'user1',
            player1score: 0,
            player2: null,
            player2score: 0
        });
    });

    it('should throw a BadRequestError for a duplicate handle', async () => {
        await Game.create(testGame);
        await expect(Game.create(testGame)).rejects.toThrow('Duplicate game: testgame');
    })
})