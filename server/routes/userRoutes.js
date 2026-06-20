const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
