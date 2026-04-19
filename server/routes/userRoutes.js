const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('./authRoutes'); // We need auth middleware to extract req.user

// JWT Authorization middleware
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    req.user = decoded; // Contains id and role
    next();
  });
};

router.get('/me', verifyToken, userController.getMe);
router.put('/profile', verifyToken, userController.updateProfile);
router.put('/password', verifyToken, userController.changePassword);
router.post('/photo', verifyToken, userController.updatePhoto);

module.exports = router;
