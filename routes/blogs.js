const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Blog = require('../models/blog');
const auth = require('../middleware/auth');

// POST /api/blogs/save-draft
router.post(
  '/save-draft',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title chahiye'),
    body('content').trim().notEmpty().withMessage('Content chahiye'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { title, content, tags, id } = req.body;
    try {
      let blog;
      if (id) {
        blog = await Blog.findById(id);
        if (!blog) {
          return res.status(404).json({ success: false, error: 'Blog nahi mila' });
        }
        blog.title = title;
        blog.content = content;
        blog.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
        blog.updated_at = Date.now();
      } else {
        blog = new Blog({
          title,
          content,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          author: req.user.userId,
        });
      }
      await blog.save();
      res.json({ success: true, blog });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// POST /api/blogs/publish
router.post(
  '/publish',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title chahiye'),
    body('content').trim().notEmpty().withMessage('Content chahiye'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { title, content, tags, id } = req.body;
    try {
      let blog;
      if (id) {
        blog = await Blog.findById(id);
        if (!blog) {
          return res.status(404).json({ success: false, error: 'Blog nahi mila' });
        }
      } else {
        blog = new Blog({
          author: req.user.userId,
        });
      }
      blog.title = title;
      blog.content = content;
      blog.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
      blog.status = 'published';
      blog.updated_at = Date.now();
      await blog.save();
      res.json({ success: true, blog });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// GET /api/blogs
router.get('/', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.userId });
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/blogs/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog nahi mila' });
    }
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;