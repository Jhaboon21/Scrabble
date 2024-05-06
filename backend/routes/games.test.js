const request = require('supertest');
const app = require('../app');
const Game = require("../models/game.js");
const db = require("../db.js");
const { createToken } = require("../helpers/tokens");

const adminToken = createToken({ username: "admin", isAdmin: true });

const testGame = {
    handle: "12345678",
    player1: "test_p1",
    player1Score: 0,
    player2: "test_p2",
    player2Score: 0
}

beforeEach(async () => {
    await db.query("BEGIN");;
});

afterEach(async () => {
    await db.query("ROLLBACK");
});

describe('GET /:handle', () => {
    test('It should respond with game info', async () => {
        await request(app).post('/games/12345678/user/test_p1').send(testGame).set("authorization", `Bearer ${adminToken}`);
        const response = await request(app).get('/games/12345678');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('game');
    });
});

describe('GET /:handle/draw/:count', () => {
    test('It should respond with drawn cards', async () => {
        const response = await request(app).get('/games/12345678/draw/5');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('cards');
        expect(response.body.cards.length).toBe(5);
    });
});

describe('POST /:handle/user/:username', () => {
    test('It should create a new game and return game info', async () => {
        const newGame = {
            handle: "12345679",
            player1: 'player1_username',
            player1Score: 0,
            player2: null,
            player2Score: 0
        };
        const response = await request(app)
            .post('/games/12345679/user/player1_username')
            .send(newGame)
            .set("authorization", `Bearer ${adminToken}`);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('game');
        expect(response.body.game).toEqual({
            handle: "12345679",
            player1: 'player1_username',
            player1score: 0,
            player2: null,
            player2score: 0
        });
    });
});

describe('PATCH /:handle/user/:username/:points', () => {
    test('It should update player points and return updated game info', async () => {
        await request(app).post('/games/12345678/user/test_p1').send(testGame).set("authorization", `Bearer ${adminToken}`);
        await request(app).patch('/games/12345678/join/test_p2').set("authorization", `Bearer ${adminToken}`);
        const response = await request(app)
            .patch('/games/12345678/user/test_p1/50')
            .set("authorization", `Bearer ${adminToken}`);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('game');
    });
});

describe('PATCH /:handle/join/:username', () => {
    test('It should add the user to the game as player2 and return game info', async () => {
        await request(app).post('/games/12345678/user/test_p1').send(testGame).set("authorization", `Bearer ${adminToken}`);
        const response = await request(app)
            .patch('/games/12345678/join/test_p2')
            .set("authorization", `Bearer ${adminToken}`);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('game');
        expect(response.body.game.player2).toBe('test_p2');
    });
});
