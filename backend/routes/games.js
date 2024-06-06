"use strict";

/** Routes for games. */

const jsonschema = require("jsonschema");

const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { createToken } = require("../helpers/tokens");
const express = require("express");
const router = express.Router();
const gameNewSchema = require("../schemas/gameNew.json");
const User = require("../models/user");
const Game = require("../models/game");
const LetterPool = require("../pool/letterPool")
const { BadRequestError } = require("../expressError");

const pool = new LetterPool(1);

/** GET /:handle => { {handle, player1, player1Score, player2, player2Score} }
 *
 * Returns info about a game with matching handle.
 *
 **/
router.get("/:handle", async function (req, res, next) {
  try {
    const game = await Game.get(req.params.handle);
    return res.json({ game })
  } catch (err) {
    return next(err);
  }
});

/** GET /:handle/draw/:count
 * 
 * draw cards from the pool 
 */
router.get("/:handle/draw/:count", async function (req, res, next) {
  try {
    const { count } = req.params;
    const deck = pool.getLetters();
    let num = 0;
    if (deck) {
      const drawn = [];
      for (let i = 0; i < count; i++) {
        const card = deck.drawLetters();
        if (card) {
          drawn.push(card);
        } else {
          break; // deck is empty
        }
      }
      num = deck.letters.length
      pool.returnLetters(deck);
      return res.json({ cards: drawn, num: num });
    }
  } catch (err) {
    return next(err);
  }
})

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
    const deck = pool.getLetters();
    deck.shuffle();
    pool.returnLetters(deck);

    const user = await User.get(req.params.username);
    const token = createToken(user);
    return res.status(201).json({ game, token });
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
    return res.status(201).json({ game });
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
    const user = await User.get(req.params.username);
    const token = createToken(user);
    return res.status(201).json({ game, token });
  } catch (err) {
    return next(err);
  }
})

module.exports = router;
