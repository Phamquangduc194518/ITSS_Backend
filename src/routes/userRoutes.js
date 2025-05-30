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
router.get('/documents', UserController.getDocuments);
router.get('/courses', UserController.getCourses);
router.get('/documents/:id', UserController.getDocumentById);
router.get('/getProfile',authenticateToken,UserController.getProfile);

router.post('/comments',authenticateToken,UserController.createRating);
router.get('/comments/:documentId',UserController.getComment);
router.post('/comments/:commentId/react', authenticateToken, UserController.reactToComment);
router.get('/byUser/documents', authenticateToken, UserController.getDocumentsByUser);

module.exports = router;