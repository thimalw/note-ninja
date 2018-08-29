const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.get('/', (req, res) => {
  res.status(200).send('Hi');
});

router.post('/register', async (req, res) => {
  const user = await UserController.create(req.body);
  res.status(user.status || 500).send(user);
});

router.post('/login', async (req, res) => {
  const token = await UserController.authenticate(req.body);
  res.status(token.status || 500).send(token);
});

module.exports = router;