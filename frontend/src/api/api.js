import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
const API_KEY = process.env.REACT_APP_API_KEY;

/** API Class
 * 
 * Static class tying together methods used to get or send to the API
 */

class ScrabbleAPI {
    // token for interacting with the API will be stored here.
    static token;

    static async requestBackend(endpoint, data = {}, method = "get") {
        console.log("API Call:", endpoint, data, method);

        const headers = { Authorization: `Bearer ${ScrabbleAPI.token}`}
        try {
            return (
                await axios({
                    url: `${BASE_URL}/${endpoint}`,
                    method,
                    [method === "get" ? "params" : "data"]: data,
                    headers
                })
            ).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    static async requestAPI(endpoint, data = {}, method = "get") {
        console.log("Wordnik API Call:", endpoint, data, method);
        try {
            return (
                await axios({
                    url: `https://api.wordnik.com/v4/word.json/${endpoint}?api_key=${API_KEY}`,
                    method,
                    [method === "get" ? "params" : "data"]: data,
                })
            );
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    // Get the current user
    static async getCurrentUser(username) {
        let res = await this.requestBackend(`users/${username}`);
        return res.user;
    }

    // Get token for login
    static async login(data) {
        let res = await this.requestBackend(`auth/token`, data, "post");
        return res.token;
    }

    // Sign up for the site
    static async signup(data) {
        let res = await this.requestBackend(`auth/register`, data, "post");
        return res.token;
    }

    // Save the user's profile
    static async saveProfile(username, data) {
        let res = await this.requestBackend(`users/${username}`, data, "patch");
        return res.user;
    }

    // Get the game room
    static async getGameRoom(handle) {
        let res = await this.requestBackend(`games/${handle}`);
        return res.game;
    }

    // Create a game with the current user as player 1
    static async createGame(handle, username, data) {
        let res = await this.requestBackend(`games/${handle}/user/${username}`, data, "post");
        console.log(res);
        return res;
    }

    // Draw letters from pool
    static async drawLetters(handle, count) {
        let res = await this.requestBackend(`games/${handle}/draw/${count}`);
        return res;
    }

    // Add points to the current player's score
    static async addPoints(handle, username, points, data={}) {
        let res = await this.requestBackend(`games/${handle}/user/${username}/${points}`, data, "patch");
        return res.game;
    }

    // Join another user's game room
    static async joinRoom(handle, username, data={player2: username}) {
        let res = await this.requestBackend(`games/${handle}/join/${username}`, data, "patch");
        console.log(res)
        return res;
    }

    // Get Scrabble score of the word
    static async scrabbleScore(word) {
        let res = await this.requestAPI(`${word}/scrabbleScore`);
        return res;
    }
}

export default ScrabbleAPI;
