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

  return makeRes(200, 'Note saved.', { note: savedNote });
};

const list = async (user) => {
  let err, notes;
  [err, notes] = await to(Note.find({ user }, '_id title createdAt'));

  if (err) {
    logger.error(err);
    return makeRes(err.status, 'Unable to retrieve notes');
  }

  if (!notes) {
    notes = [];
  }

  return makeRes(200, 'Notes retrieved', { notes });
};

const read = async (id, user) => {
  let err, note;
  [err, note] = await to(Note.findOne({ _id: id, user }));

  if (err) {
    logger.error(err);
    return makeRes(err.status, 'Unable to retrieve note');
  }

  if (note) {
    return makeRes(200, 'Note retrieved', { note });
  }

  return makeRes(404, 'Note not found');
};

const update = async (id, user, note) => {
  let err, savedNote;
  [err, savedNote] = await to(Note.findOneAndUpdate({ _id: id, user }, note, { new: true }));

  if (err) {
    logger.error(err);
    return makeRes(err.status, 'Unable to update note');
  }

  if (savedNote) {
    return makeRes(200, 'Note updated', { note: savedNote });
  }

  return makeRes(404, 'Note not found');
};

const remove = async (id, user) => {
  let err, data;
  [err, data] = await to(Note.deleteOne({ _id: id, user }));

  if (err) {
    logger.error(err);
    return makeRes(err.status, 'Unable to delete note');
  }

  if (data.n > 0) {
    return makeRes(200, 'Note deleted');
  }

  return makeRes(404, 'Note not found');
};

module.exports = {
  create,
  list,
  read,
  update,
  remove
};