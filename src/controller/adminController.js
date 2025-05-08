// src/controllers/academicController.js
const { Op } = require('sequelize');
const Faculty       = require('../model/Faculty');
const Department    = require('../model/Department');
const Course        = require('../model/Course');
const DocumentHust  = require('../model/DocumentHust');
const User = require('../model/User');

const getFaculties = async (req, res) => {
  try {
    const data = await Faculty.findAll();
    res.json({ data });
  } catch (error) {
    console.error('getFaculties error', error);
    res.status(500).json({ message: 'Server error listing faculties' });
  }
};

const createFaculty = async (req, res) => {
  const { name, introduce } = req.body;
  if (!name) return res.status(400).json({ message: 'Missing faculty name' });
  try {
    const exists = await Faculty.findOne({ where: { name } });
    if (exists) return res.status(400).json({ message: 'Faculty already exists' });
    const faculty = await Faculty.create({ name, introduce });
    res.status(201).json({ data: faculty });
  } catch (error) {
    console.error('createFaculty error', error);
    res.status(500).json({ message: 'Server error creating faculty' });
  }
};

const updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { name, introduce } = req.body;
  if (!name) return res.status(400).json({ message: 'Missing faculty name' });
  try {
    const faculty = await Faculty.findByPk(id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    const dup = await Faculty.findOne({ where: { name, id: { [Op.ne]: id } } });
    if (dup) return res.status(400).json({ message: 'Name already in use' });
    faculty.name = name;
    faculty.introduce = introduce;
    await faculty.save();
    res.json({ data: faculty });
  } catch (error) {
    console.error('updateFaculty error', error);
    res.status(500).json({ message: 'Server error updating faculty' });
  }
};

const deleteFaculty = async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Faculty.findByPk(id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    await faculty.destroy();
    res.json({ message: 'Faculty deleted' });
  } catch (error) {
    console.error('deleteFaculty error', error);
    res.status(500).json({ message: 'Server error deleting faculty' });
  }
};

const getDepartments = async (req, res) => {
  try {
    const data = await Department.findAll();
    res.json({ data });
  } catch (error) {
    console.error('getDepartments error', error);
    res.status(500).json({ message: 'Server error listing departments' });
  }
};

const createDepartment = async (req, res) => {
  const { name, faculty_id } = req.body;
  if (!name || !faculty_id) return res.status(400).json({ message: 'Missing fields' });
  try {
    const exists = await Department.findOne({ where: { name, faculty_id } });
    if (exists) return res.status(400).json({ message: 'Department exists in faculty' });
    const dept = await Department.create({ name, faculty_id });
    res.status(201).json({ data: dept });
  } catch (error) {
    console.error('createDepartment error', error);
    res.status(500).json({ message: 'Server error creating department' });
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, faculty_id } = req.body;
  if (!name || !faculty_id) return res.status(400).json({ message: 'Missing fields' });
  try {
    const dept = await Department.findByPk(id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    const dup = await Department.findOne({ where: { name, faculty_id, id: { [Op.ne]: id } } });
    if (dup) return res.status(400).json({ message: 'Duplicate department in faculty' });
    dept.name = name;
    dept.faculty_id = faculty_id;
    await dept.save();
    res.json({ data: dept });
  } catch (error) {
    console.error('updateDepartment error', error);
    res.status(500).json({ message: 'Server error updating department' });
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const dept = await Department.findByPk(id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    await dept.destroy();
    res.json({ message: 'Department deleted' });
  } catch (error) {
    console.error('deleteDepartment error', error);
    res.status(500).json({ message: 'Server error deleting department' });
  }
};

const getCourses = async (req, res) => {
  try {
    const data = await Course.findAll();
    res.json({ data });
  } catch (error) {
    console.error('getCourses error', error);
    res.status(500).json({ message: 'Server error listing courses' });
  }
};

const createCourse = async (req, res) => {
  const { name, code, department_id } = req.body;
  if (!name || !department_id) return res.status(400).json({ message: 'Missing fields' });
  try {
    const exists = await Course.findOne({ where: { name, department_id } });
    if (exists) return res.status(400).json({ message: 'Course exists in department' });
    const course = await Course.create({ name, code, department_id });
    res.status(201).json({ data: course });
  } catch (error) {
    console.error('createCourse error', error);
    res.status(500).json({ message: 'Server error creating course' });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, code, department_id } = req.body;
  if (!name || !department_id) return res.status(400).json({ message: 'Missing fields' });
  try {
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const dup = await Course.findOne({ where: { name, department_id, id: { [Op.ne]: id } } });
    if (dup) return res.status(400).json({ message: 'Duplicate course in department' });
    course.name = name;
    course.code = code;
    course.department_id = department_id;
    await course.save();
    res.json({ data: course });
  } catch (error) {
    console.error('updateCourse error', error);
    res.status(500).json({ message: 'Server error updating course' });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.destroy();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('deleteCourse error', error);
    res.status(500).json({ message: 'Server error deleting course' });
  }
};

const getDocuments = async (req, res) => {
  try {
    const data = await DocumentHust.findAll({
        include:[
            {
                model: Course,
                attributes:["id","name","code"]
            }
        ]
    });
    res.json({ data });
  } catch (error) {
    console.error('getDocuments error', error);
    res.status(500).json({ message: 'Server error listing documents' });
  }
};

const getDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await DocumentHust.findByPk(id, {
      include: [
        { model: Course, attributes:['id','name'], include:[{ model: Department, attributes:['id','name'] }] },
      ]
    });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json({ data: doc });
  } catch (error) {
    console.error('getDocument error', error);
    res.status(500).json({ message: 'Server error fetching document' });
  }
};

const createDocumentByAdmin = async (req, res) => {
  const { title, description, file_path, course_id, year_id } = req.body;
  if (!title || !file_path || !course_id || !year_id) return res.status(400).json({ message: 'Missing fields' });
  try {
    const doc = await DocumentHust.create({ title, description, file_path, course_id, year_id });
    res.status(201).json({ data: doc });
  } catch (error) {
    console.error('createDocument error', error);
    res.status(500).json({ message: 'Server error creating document' });
  }
};

const updateDocumentByAdmin = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const doc = await DocumentHust.findByPk(id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    Object.assign(doc, updates);
    await doc.save();
    res.json({ data: doc });
  } catch (error) {
    console.error('updateDocument error', error);
    res.status(500).json({ message: 'Server error updating document' });
  }
};

const deleteDocumentByAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await DocumentHust.findByPk(id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    await doc.destroy();
    res.json({ message: 'Document deleted' });
  } catch (error) {
    console.error('deleteDocument error', error);
    res.status(500).json({ message: 'Server error deleting document' });
  }
};

const getUser = async(req, res)=>{
    try{
        const users= await User.findAll()
        return res.status(200).json(users) 
    }catch(error){
        return res.status(500).json({ message: "Không có người dùng nào" });
    }
}

const deleteUser = async(req, res)=>{
    try{
        const{userId} = req.params;
        const users= await User.findOne({
            where:{id: userId}
        })
        await User.destroy(users);
        return res.status(200).json("đã xóa tài khỏan thành công") 
    }catch(error){
        return res.status(500).json({ message: "Không có người dùng nào" });
    }
}

module.exports = {
  getFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getDocuments,
  getDocument,
  createDocumentByAdmin,
  updateDocumentByAdmin,
  deleteDocumentByAdmin,
  getUser,
  deleteUser
};