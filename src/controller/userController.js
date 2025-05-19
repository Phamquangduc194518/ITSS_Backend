const jwt  = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const Faculty = require('../model/Faculty');
const { Op } = require('sequelize');
const { Course, DocumentHust, Department } = require('../model');

const register = async (req, res) => {
    const { username, email, password, role} = req.body;
    if (!username || !email || !password) {
      return res.status(400).send('Vui lòng cung cấp đầy đủ thông tin');
    }
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).send('Email đã được sử dụng');
      }
      const existingUserName = await User.findOne({ where: { username } });
      if (existingUserName) {
        return res.status(400).send('UserName đã được sử dụng');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        active: false,
        role: role || "normal",
      });
      return res.status(200).json({ message: "Đăng ký tài khoản thành công"})
    } catch (error) {
      console.error('Lỗi trong quá trình đăng ký:', error);
      return res.status(500).send('Lỗi máy chủ, vui lòng thử lại sau');
    }
  };

  const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).send('Vui lòng cung cấp email và mật khẩu');
    }
  
    try {
      const user = await User.findOne({ 
        where: { email },
        attributes: ['id', 'username', 'email', 'password', 'avatar_url', 'phone', 'role']
      });
      if (!user) {
        return res.status(404).send('Email không tồn tại');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Mật khẩu không chính xác');
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, rank: user.rank},
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
    );
      await User.update({ active: 1 }, { where: { id: user.id } });
      return res.status(200).json({ 
        message: "Đăng nhập thành công",
        token: token,
        user:{
          id: user.id,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
          role: user.role,
        }});
    } catch (error) {
      console.error('Lỗi trong quá trình đăng nhập:', error);
      return res.status(500).send('Lỗi máy chủ, vui lòng thử lại sau');
    }
  };

  const createDocumentByUser= async (req, res) => {
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
  
  const updateDocumentByUser= async (req, res) => {
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
  
  const deleteDocumentByUser = async (req, res) => {
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

  const searchDocumentsByUser = async (req, res) => {
    try {
      const { keyword } = req.query;   
   
      const includeCourse = {
        model: Course,
        attributes: ['id','name','code'],
        ...(keyword && {
          where: { name: { [Op.like]: `%${keyword}%` } },
          required: true
        })
      };
  
      const docs = await DocumentHust.findAll({
        include: [ includeCourse ]
      });
  
      return res.json({ data: docs });
    } catch (error) {
      console.error('searchDocumentsByUser error', error);
      return res.status(500).json({ message: 'Server error searching documents' });
    }
  };
  const filterDocuments = async (req, res) => {
  const { year_id, department_id, course_id } = req.query;
  try {
    const whereDoc = {};
    if (year_id) whereDoc.year_id = year_id;
    const includeCourse = {
      model: Course,
      attributes: ['id', 'name', 'code', 'department_id'],
      where: {},
      include: [
        {
          model: Department,
          attributes: ['id', 'name', 'faculty_id'],
          where: {},
          include: [
            {
              model: Faculty,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    };
    if (course_id) {
      includeCourse.where.id = course_id;
    }
    if (department_id) {
      includeCourse.include[0].where.id = department_id;
    }
    const docs = await DocumentHust.findAll({
      where: whereDoc,
      include: [ includeCourse ]
    });

    return res.json({ data: docs });
  } catch (error) {
    console.error('filterDocuments error', error);
    return res.status(500).json({ message: 'Server error filtering documents' });
  }
};
module.exports ={
    register,
    login,
    createDocumentByUser,
    updateDocumentByUser,
    deleteDocumentByUser,
    searchDocumentsByUser,
    filterDocuments
}