const request = require('supertest');
const app = require('../app');
const { createToken } = require("../helpers/tokens");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const db = require("../db.js");

const testUser = {
    username: 'testuser',
    password: 'password',
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    isAdmin: false
};

let token;

beforeEach(async () => {
    await db.query("BEGIN");;
    await User.register(testUser);
    token = createToken(testUser);
});

afterEach(async () => {
    await User.remove(testUser.username);
    await db.query("ROLLBACK");
});

describe('POST /users', () => {
    test('Adds a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                username: 'newuser',
                password: 'password',
                firstName: 'New',
                lastName: 'User',
                email: 'newuser@example.com',
                isAdmin: false
            })
            .expect(201);

        expect(response.body).toEqual(expect.objectContaining({
            user: expect.objectContaining({
                username: 'newuser',
                firstName: 'New',
                lastName: 'User',
                email: 'newuser@example.com'
            }),
            token: expect.any(String)
        }));
    });
});

describe('GET /users/:username', () => {
    test('Returns user details', async () => {
        const response = await request(app)
            .get(`/users/${testUser.username}`)
            .set('authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body).toEqual(expect.objectContaining({
            user: expect.objectContaining({
                username: testUser.username,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email
            })
        }));
    });
});

describe('PATCH /users/:username', () => {
    test('Updates user details', async () => {
        const response = await request(app)
            .patch(`/users/${testUser.username}`)
            .set('authorization', `Bearer ${token}`)
            .send({
                firstName: 'Updated',
                lastName: 'User'
            })
            .expect(200);

        expect(response.body).toEqual(expect.objectContaining({
            user: expect.objectContaining({
                username: testUser.username,
                firstName: 'Updated',
                lastName: 'User',
                email: testUser.email
            })
        }));
    });
});