"use strict";

/** Routes for games. */

const pool = [];
const letters = [
  "A", "A", "A", "A", "A", "A", "A", "A", "A",
  "B", "B",
  "C", "C",
  "D", "D", "D", "D",
  "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
  "F", "F",
  "G", "G", "G",
  "H", "H",
  "I", "I", "I", "I", "I", "I", "I", "I", "I",
  "J",
  "K",
  "L", "L", "L", "L",
  "M", "M",
  "N", "N", "N", "N", "N", "N",
  "O", "O", "O", "O", "O", "O", "O", "O",
  "P", "P",
  "Q",
  "R", "R", "R", "R", "R", "R",
  "S", "S", "S", "S",
  "T", "T", "T", "T", "T", "T",
  "U", "U", "U", "U",
  "V", "V",
  "W", "W",
  "X",
  "Y", "Y",
  "Z"
];
let player1Letters = [];
let player2Letters = [];

const jsonschema = require("jsonschema");

const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");

const Game = require("../models/game");
const express = require("express");
const { createToken } = require("../helpers/tokens");
const gameNewSchema = require("../schemas/gameNew.json");
const { BadRequestError } = require("../expressError");

const router = express.Router();

// shuffle the "bag of letters" 
function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// pull from the pool and give to the player letters up to max of 7.
function drawLetters(arr) {
  while (arr.length < 7 && pool.length > 0) {
    let i = 7 - arr.length;
    let addLetters = pool.splice(0, i);
    arr.push(...addLetters);
  }
}

/** GET /:handle => { {handle, player1, player1Score, player2, player2Score} }
 *
 * Returns info about a game with matching handle.
 *
 **/
router.get("/:handle", async function (req, res, next) {
  try {
    const game = await Game.get(req.params.handle);
    return res.json({ game, pool, player1Letters, player2Letters });
  } catch (err) {
    return next(err);
  }
});

/** POST /[handle]/user/[username] { game }  => { game, token }
 *
 * Adds a new game. This is not the registration endpoint --- instead, this is
 * only for admin or current logged in users to add new game.
 *
 * This returns the newly created game and an authentication token for them:
 *  { game: { handle, player1, player1Score, player2, player2Score }, token }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.post("/:handle/user/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, gameNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const game = await Game.create(req.body);
    let shuffledLetters = shuffle(letters);
    pool.push(...shuffledLetters);
    drawLetters(player1Letters);
    console.log(player1Letters)

    return res.status(201).json({ game, pool, player1Letters });
  } catch (err) {
    console.log("Error at the .post");
    return next(err);
  }
});

/** PATCH /[handle]/[username]/[points] { game } => { game, token } 
 * 
 * update points on a player's score
 * 
 * Authorization required: same user-as-:username
*/
router.patch("/:handle/user/:username/:points", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const game = await Game.addPoints(req.params.handle, req.params.username, req.params.points)
    const token = createToken(game);
    return res.status(201).json({ game, token });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle]/join/[username] { game } => { game } 
 * 
 * Insert this user into the player2 slot
*/
router.patch("/:handle/join/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const game = await Game.addSecondPlayer(req.params.handle, req.params.username);
    console.log(pool);
    drawLetters(player2Letters);
    console.log(player1Letters);
    console.log(player2Letters);
    console.log(pool);

    return res.status(201).json({ game, pool, player2Letters });
  } catch (err) {
    return next(err);
  }
})

module.exports = router;