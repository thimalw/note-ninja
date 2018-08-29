const router = require('express').Router();

// routes
router.use('/user', require('./user'));
router.use('/notes', require('./notes'));

// TODO: handle unhandled errors

module.exports = router;