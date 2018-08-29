const router = require('express').Router();
const NotesController = require('../controllers/NotesController');

router.post('/', async (req, res) => {
  const note = await NotesController.create(req.body);
  res.status(note.status).send(note);
});

module.exports = router;