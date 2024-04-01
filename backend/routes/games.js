"use strict";

/** Routes for games. */

const jsonschema = require("jsonschema");

const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");

const Game = require("../models/game");
const express = require("express");
const { createToken } = require("../helpers/tokens");
const gameNewSchema = require("../schemas/gameNew.json");
const { BadRequestError } = require("../expressError");

const router = express.Router();

/** GET /:handle => { {handle, player1, player1Score, player2, player2Score} }
 *
 * Returns info about a game with matching handle.
 *
 **/
router.get("/:handle", async function (req, res, next) {
  try {
    const game = await Game.get(req.params.handle);
    return res.json({ game });
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
    return res.status(201).json({ game });
  } catch (err) {
    console.log("Error at the .post");
    return next(err);
  }
});

/** PATCH /[handle]/[username]/[points] { game } => { game } 
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
    const token = createToken(game);
    return res.status(201).json({ game, token });
  } catch (err) {
    return next(err);
  }
})

module.exports = router;