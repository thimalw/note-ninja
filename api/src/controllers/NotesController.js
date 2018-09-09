const Note = require('../models/Note');
const logger = require('../services/winston');
const { makeRes, to } = require('../helpers');

const create = async (user, note) => {
  note.user = user;

  let err, savedNote;
  const noteInstance = new Note(note);
  [err, savedNote] = await to(noteInstance.save());
  
  if (err) {
    logger.error(err);
    return makeRes(err.status || 500, 'Unable to save note.');
  }

  return makeRes(200, 'Note saved.', savedNote);
};

const list = async (user) => {
  let err, notes;
  [err, notes] = await to(Note.find({ user }, '_id title createdAt'));

  if (err) {
    logger.error(err);
    return makeRes(err.status, 'Unable to retrieve notes');
  }

  if (notes) {
    return makeRes(200, 'Notes retrieved', { notes });
  }

  return makeRes(404, 'No notes found');
};

const read = async (user, _id) => {
  let err, note;
  [err, note] = await to(Note.findOne({ user, _id }));

  if (err) {
    logger.error(err);
    return makeRes(err.status, 'Unable to retrieve note');
  }

  if (note) {
    return makeRes(200, 'Note retrieved', { note });
  }

  return makeRes(404, 'Note not found');
};

module.exports = {
  create,
  list,
  read
};