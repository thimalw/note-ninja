const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  body: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);