const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// Save hone pe updated_at update kar
BlogSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Performance ke liye index
BlogSchema.index({ status: 1 });

module.exports = mongoose.model('Blog', BlogSchema);