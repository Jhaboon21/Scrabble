import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class
 * 
 * Static class tying together methods used to get or send to the API
 */

class ScrabbleAPI {
    // token for interacting with the API will be stored here.
    static token;
    // hardcoded api key for testing
    static apiKey = "";

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
        const headers = { Authorization: `Bearer ${ScrabbleAPI.apiKey}` }
        try {
            return (
                await axios({
                    url: `api.wordnik.com/v4/word.json/${endpoint}`,
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
        return res;
    }

    // Create a game with the current user as player 1
    static async createGame(handle, username, data) {
        let res = await this.requestBackend(`games/${handle}/user/${username}`, data, "post");
        // console.log(res);
        return res.token;
    }

    // Add points to the current player's score
    static async addPoints(handle, username, points, data) {
        let res = await this.requestBackend(`games/${handle}/user/${username}/${points}`, data, "patch");
        return res.token;
    }

    // Join another user's game room
    static async joinRoom(handle, username, data={player2: username}) {
        let res = await this.requestBackend(`games/${handle}/join/${username}`, data, "patch");
        return res.game;
    }

    // Get Scrabble score of the word
    static async scrabbleScore(word, data) {
        let res = await this.requestAPI(`${word}/scrabbleScore`, data, "get");
        console.log(res);
        console.log(res.value);
        return res.value;
    }
}

export default ScrabbleAPI;