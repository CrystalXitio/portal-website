const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminController = require('../controllers/adminController');

const verifyTokenAndAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    if (decoded.role !== 'admin') {
       return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    req.user = decoded; // Contains id and role
    next();
  });
};

router.use(verifyTokenAndAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.delete('/user/:id', adminController.deleteUser);

// Generic resourceful routes
router.get('/:model', adminController.getResource);
router.post('/:model', adminController.createResource);
router.put('/:model/:id', adminController.updateResource);
router.delete('/:model/:id', adminController.deleteResource);

module.exports = router;
