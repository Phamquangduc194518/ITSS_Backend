const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController')
const { authenticateToken} = require('../middlewares/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.post('/documents', authenticateToken,UserController.createDocumentByUser);
router.put('/documents/:id', authenticateToken, UserController.updateDocumentByUser);
router.delete('/documents/:id',authenticateToken, UserController.deleteDocumentByUser);

router.get('/documents/search', UserController.searchDocumentsByUser);
router.get('/documents/filter', UserController.filterDocuments);

module.exports = router;