const db = require("../db");
const User = require("../models/user");

const testUser = {
    username: "test_user",
    password: "password",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    isAdmin: false,
};

beforeEach(async () => {
    await db.query("BEGIN");;
});

afterEach(async () => {
    await db.query("ROLLBACK");
});

describe("authentication", () => {
    it('should authenticate a user with valid credentials', async () => {
        await User.register(testUser);
        const authenticatedUser = await User.authenticate(
            testUser.username,
            testUser.password
        );

        expect(authenticatedUser).toEqual(
            expect.objectContaining({
                username: testUser.username,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email,
                isAdmin: testUser.isAdmin,
            })
        );
    });

    it('should throw UnauthorizedError for invalid credentials', async () => {
        await expect(User.authenticate(testUser.username, "wrongpassword"))
        .rejects.toThrow("Invalid username/password");
    });
});

describe("register", () => {
    it('should register a new user', async () => {
        const registeredUser = await User.register(testUser);
        expect(registeredUser).toEqual(
            expect.objectContaining({
                username: testUser.username,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email,
                isAdmin: testUser.isAdmin,
            })
        );
    })
})