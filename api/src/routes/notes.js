const router = require('express').Router();
const passport = require('passport');
const jwtStrategry = require("../services/jwtStrategry");
const NotesController = require('../controllers/NotesController');

passport.use(jwtStrategry);

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const note = await NotesController.create(req.user._id, req.body);
  res.status(note.status).send(note);
});

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const notes = await NotesController.list(req.user._id);
  res.status(notes.status).send(notes);
});

module.exports = router;