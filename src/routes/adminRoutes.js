const express = require('express');
const router = express.Router();
const AdminController = require('../controller/adminController')

router.get('/users', AdminController.getUser);
router.delete('/users/:id', AdminController.deleteUser);

router.get('/faculties', AdminController.getFaculties);
router.post('/faculties', AdminController.createFaculty);
router.patch('/faculties/:id', AdminController.updateFaculty);
router.delete('/faculties/:id', AdminController.deleteFaculty);

router.get('/departments', AdminController.getDepartments);
router.post('/departments', AdminController.createDepartment);
router.patch('/departments/:id', AdminController.updateDepartment);
router.delete('/departments/:id', AdminController.deleteDepartment);

router.get('/courses', AdminController.getCourses);
router.post('/courses', AdminController.createCourse);
router.patch('/courses/:id', AdminController.updateCourse);
router.delete('/courses/:id', AdminController.deleteCourse);

router.get('/documents', AdminController.getDocuments);
router.get('/documents/:id', AdminController.getDocument);
router.post('/documents', AdminController.createDocumentByAdmin);
router.patch('/documents/:id', AdminController.updateDocumentByAdmin);
router.delete('/documents/:id', AdminController.deleteDocumentByAdmin);

module.exports = router;
