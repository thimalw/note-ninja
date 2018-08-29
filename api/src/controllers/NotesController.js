const mongoose = require('mongoose');
const Note = require('../models/Note');
const logger = require('../services/winston');
const { makeRes, to } = require('../helpers');

const create = async (note) => {
  let err, savedNote;
  const noteInstance = new Note(note);
  [err, savedNote] = await to(noteInstance.save());
  
  if (err) {
    logger.error(err);
    return makeRes(err.status || 500, 'Unable to save note.');
  }

  return makeRes(200, 'Note saved.', savedNote);
};

module.exports = {
  create
};