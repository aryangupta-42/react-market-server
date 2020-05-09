const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  desc: String,
  category: String,
  addedBy: {
    uid: mongoose.Schema.Types.ObjectId,
  },
  price: String,
  addedOn: {
    type: Date,
    default: Date.now,
  },
  location: String,
  img: [String],
  status: { type: String, enum: ['available', 'sold'] },
  hidden: Boolean,
});

module.exports = mongoose.model('items', itemSchema);
