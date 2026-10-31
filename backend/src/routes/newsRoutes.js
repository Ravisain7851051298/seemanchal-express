const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');

// Helper to make slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0900-\u097F-]+/g, '') // preserves English and Devanagari Hindi characters
    .replace(/--+/g, '-')
    .substring(0, 80);
};

// @route   GET /api/news
// @desc    Get all published news with filters & pagination
router.get('/', async (req, res) => {
  try {
    const { category, search, tag, isBreaking, isFeatured, isTrending, page = 1, limit = 12 } = req.query;
    const query = { status: 'published' };

    if (category) {
      // Check if category is slug or ID
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) query.category = cat._id;
      }
    }

    if (isBreaking === 'true') {
      query.isBreaking = true;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    if (isTrending === 'true') {
      query.isTrending = true;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      const trimmedSearch = search.trim();
      const escapedFullSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Split into words, removing single-letter symbols
      const rawWords = trimmedSearch.split(/\s+/).map((w) => w.trim()).filter((w) => w.length > 1);

      const conditions = [
        { title: { $regex: escapedFullSearch, $options: 'i' } },
        { subtitle: { $regex: escapedFullSearch, $options: 'i' } },
        { content: { $regex: escapedFullSearch, $options: 'i' } },
        { location: { $regex: escapedFullSearch, $options: 'i' } },
        { tags: { $regex: escapedFullSearch, $options: 'i' } },
        { categoryName: { $regex: escapedFullSearch, $options: 'i' } },
        { authorName: { $regex: escapedFullSearch, $options: 'i' } },
      ];

      // Add each individual search word for intelligent multi-term matching
      rawWords.forEach((word) => {
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        conditions.push(
          { title: { $regex: escapedWord, $options: 'i' } },
          { subtitle: { $regex: escapedWord, $options: 'i' } },
          { tags: { $regex: escapedWord, $options: 'i' } },
          { location: { $regex: escapedWord, $options: 'i' } },
          { content: { $regex: escapedWord, $options: 'i' } }
        );
      });

      query.$or = conditions;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('category', 'name nameHindi slug')
      .populate('author', 'name photo role assignedDesignation')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Fetch similar / recommended news for smart search results
    let similarNews = [];
    if (search) {
      const existingIds = news.map((n) => n._id);
      let matchedCategories = [];
      news.forEach((n) => {
        if (n.category && n.category._id) matchedCategories.push(n.category._id);
      });

      const similarQuery = {
        status: 'published',
        _id: { $nin: existingIds },
      };

      if (matchedCategories.length > 0) {
        similarQuery.category = { $in: matchedCategories };
      }

      similarNews = await News.find(similarQuery)
        .populate('category', 'name nameHindi slug')
        .populate('author', 'name photo role assignedDesignation')
        .sort({ views: -1, publishedAt: -1 })
        .limit(6);

      // If fewer than 4 similar stories, supplement with latest published news
      if (similarNews.length < 4) {
        const moreIds = [...existingIds, ...similarNews.map((s) => s._id)];
        const extraNews = await News.find({
          status: 'published',
          _id: { $nin: moreIds },
        })
          .populate('category', 'name nameHindi slug')
          .populate('author', 'name photo role assignedDesignation')
          .sort({ publishedAt: -1 })
          .limit(6 - similarNews.length);
        similarNews = [...similarNews, ...extraNews];
      }
    }

    res.json({
      success: true,
      count: news.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      news,
      similarNews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/news/breaking
// @desc    Get top breaking news for live ticker
router.get('/breaking', async (req, res) => {
  try {
    const news = await News.find({ status: 'published', isBreaking: true })
      .select('title slug categoryName publishedAt')
      .sort({ publishedAt: -1 })
      .limit(10);
    res.json({ success: true, count: news.length, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/news/featured
// @desc    Get featured top headline stories
router.get('/featured', async (req, res) => {
  try {
    const news = await News.find({ status: 'published', isFeatured: true })
      .populate('category', 'name nameHindi slug')
      .populate('author', 'name photo')
      .sort({ publishedAt: -1 })
      .limit(10);
    res.json({ success: true, count: news.length, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/news/trending
// @desc    Get top trending stories
router.get('/trending', async (req, res) => {
  try {
    let news = await News.find({ status: 'published', isTrending: true })
      .populate('category', 'name nameHindi slug')
      .populate('author', 'name photo')
      .sort({ publishedAt: -1 })
      .limit(12);

    // If fewer than 4 trending news exist, supplement with highest-viewed published stories
    if (news.length < 4) {
      const existingIds = news.map((n) => n._id);
      const fillers = await News.find({
        status: 'published',
        _id: { $nin: existingIds },
      })
        .populate('category', 'name nameHindi slug')
        .populate('author', 'name photo')
        .sort({ views: -1, publishedAt: -1 })
        .limit(12 - news.length);
      news = [...news, ...fillers];
    }
    res.json({ success: true, count: news.length, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/news/reporter/my-submissions
// @desc    Get news submitted by the logged in reporter
router.get('/reporter/my-submissions', protect, authorize('reporter', 'admin'), async (req, res) => {
  try {
    const news = await News.find({ author: req.user._id })
      .populate('category', 'name nameHindi slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: news.length, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/news/:slug
// @desc    Get single news by slug & increment views
router.get('/:slug', async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug })
      .populate('category', 'name nameHindi slug')
      .populate('author', 'name photo role assignedDesignation bio');

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    // Increment view count
    news.views += 1;
    await news.save();

    // Related news in same category
    const relatedNews = await News.find({
      category: news.category._id,
      _id: { $ne: news._id },
      status: 'published',
    })
      .select('title slug thumbnail publishedAt location views')
      .limit(4);

    res.json({ success: true, news, relatedNews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/news
// @desc    Create news (Reporter creates as 'pending', Admin creates as 'published')
router.post('/', protect, authorize('admin', 'reporter'), async (req, res) => {
  try {
    const {
      title,
      subtitle,
      category,
      content,
      thumbnail,
      videoUrl,
      images,
      tags,
      location,
      isBreaking,
      isFeatured,
      isTrending,
    } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: 'Title, category, and content are required' });
    }

    const catDoc = await Category.findById(category);
    if (!catDoc) {
      return res.status(400).json({ success: false, message: 'Invalid category specified' });
    }

    // Generate unique slug
    let baseSlug = slugify(title) || 'news';
    let slug = baseSlug;
    let counter = 1;
    while (await News.findOne({ slug })) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}${counter++}`;
    }

    const isAdmin = req.user.role === 'admin';
    const status = isAdmin ? 'published' : 'pending';

    const news = await News.create({
      title,
      slug,
      subtitle: subtitle || '',
      category,
      categoryName: catDoc.name,
      content,
      thumbnail: thumbnail || '/uploads/default-news.jpg',
      videoUrl: videoUrl || '',
      images: images || [],
      tags: tags || [],
      author: req.user._id,
      authorName: req.user.name,
      location: location || (isAdmin ? 'नई दिल्ली' : req.user.assignedLocation || 'सीमांचल'),
      status,
      isBreaking: isAdmin ? Boolean(isBreaking) : false,
      isFeatured: isAdmin ? Boolean(isFeatured) : false,
      isTrending: isAdmin ? Boolean(isTrending) : false,
      publishedAt: status === 'published' ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: isAdmin ? 'News published successfully' : 'News submitted for editorial review',
      news,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/news/:id
// @desc    Update news
router.put('/:id', protect, authorize('admin', 'reporter'), async (req, res) => {
  try {
    let news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    // Reporters can only edit their own news
    if (req.user.role === 'reporter' && news.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this article' });
    }

    const fields = ['title', 'subtitle', 'category', 'content', 'thumbnail', 'videoUrl', 'images', 'tags', 'location'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) news[field] = req.body[field];
    });

    // If reporter edits a rejected article, reset status to pending for re-review!
    if (req.user.role === 'reporter' && news.status === 'rejected') {
      news.status = 'pending';
      news.rejectionReason = '';
    }

    if (req.user.role === 'admin') {
      if (req.body.isBreaking !== undefined) news.isBreaking = req.body.isBreaking;
      if (req.body.isFeatured !== undefined) news.isFeatured = req.body.isFeatured;
      if (req.body.isTrending !== undefined) news.isTrending = req.body.isTrending;
      if (req.body.status !== undefined) {
        news.status = req.body.status;
        if (req.body.status === 'published' && !news.publishedAt) {
          news.publishedAt = new Date();
        }
      }
      if (req.body.rejectionReason !== undefined) news.rejectionReason = req.body.rejectionReason;
    }

    await news.save();
    res.json({ success: true, message: 'News updated successfully', news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/news/:id
// @desc    Delete news (Admin, or Reporter for their own unpublished story)
router.delete('/:id', protect, authorize('admin', 'reporter'), async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    if (req.user.role === 'reporter') {
      if (news.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this article' });
      }
      if (news.status === 'published') {
        return res.status(400).json({
          success: false,
          message: 'Published reports can only be taken down or deleted by Editorial Admin',
        });
      }
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'News article deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
