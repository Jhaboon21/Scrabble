import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class
 * 
 * Static class tying together methods used to get or send to the API
 */

class ScrabbleAPI {
    // token for interacting with the API will be stored here.
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

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

    // Individual API routes

    // Get the current user
    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    // Get token for login
    static async login(data) {
        let res = await this.request(`auth/token`, data, "post");
        return res.token;
    }

    // Sign up for the site
    static async signup(data) {
        let res = await this.request(`auth/register`, data, "post");
        return res.token;
    }

    // Save the user's profile
    static async saveProfile(username, data) {
        let res = await this.request(`users/${username}`, data, "patch");
        return res.user;
    }
}

export default ScrabbleAPI;