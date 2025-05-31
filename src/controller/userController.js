const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const Faculty = require('../model/Faculty');
const { Op } = require('sequelize');
const { Course, DocumentHust, Department, Comment } = require('../model');
const CommentReaction = require('../model/CommentReaction');

const register = async (req, res) => {
  const { username, email, password, role } = req.body;
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
    return res.status(200).json({ message: "Đăng ký tài khoản thành công" })
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
      { id: user.id, email: user.email, role: user.role, rank: user.rank },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    await User.update({ active: 1 }, { where: { id: user.id } });
    return res.status(200).json({
      message: "Đăng nhập thành công",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Lỗi trong quá trình đăng nhập:', error);
    return res.status(500).send('Lỗi máy chủ, vui lòng thử lại sau');
  }
};

const createDocumentByUser = async (req, res) => {
  const { title, description, file_path, course_id, year_id, imgUrl } = req.body;
  if (!title || !file_path || !course_id || !year_id) return res.status(400).json({ message: 'Missing fields' });
  try {
    const doc = await DocumentHust.create({ title, description, file_path, course_id, year_id, imgUrl });
    res.status(201).json({ data: doc });
  } catch (error) {
    console.error('createDocument error', error);
    res.status(500).json({ message: 'Server error creating document' });
  }
};

const updateDocumentByUser = async (req, res) => {
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
      attributes: ['id', 'name', 'code'],
      ...(keyword ? {
        where: { name: { [Op.like]: `%${keyword}%` } },
        required: true
      } : {}),
      include: [
        {
          model: Department,
          attributes: ['id', 'name'],
          include: [
            {
              model: Faculty,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    };

    const docs = await DocumentHust.findAll({
      include: [
        includeCourse
      ]
    });

    return res.json({ data: docs });
  } catch (error) {
    console.error('searchDocumentsByUser error', error);
    return res.status(500).json({ message: 'Server error searching documents' });
  }
};
const filterDocuments = async (req, res) => {
  const { year_id, department_id, course_id } = req.query;
  const where = {};
  if (year_id) where.year_id = year_id;
  if (department_id) where['$course.department_id$'] = department_id;
  if (course_id) where['$course.id$'] = course_id;

  try {
    const docs = await DocumentHust.findAll({
      where,
      include: [{
        model: Course,
        attributes: ['id', 'name', 'department_id'],
        include: [{
          model: Department,
          attributes: ['id', 'name', 'faculty_id'],
          include: [{
            model: Faculty,
            attributes: ['id', 'name']
          }]
        }]
      }]
    });

    return res.json({ data: docs });
  } catch (error) {
    console.error('filterDocuments error', error);
    return res.status(500).json({ message: 'Server error filtering documents' });
  }
};
const getDocuments = async (req, res) => {
  try {
    const data = await DocumentHust.findAll({
      limit: 6,
      where: {
        status: "approved"
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Course,
          attributes: ["id", "name", "code", "imgUrl"],
          include: [
            {
              model: Department,
              attributes: ['id', 'name'],
              include: [
                {
                  model: Faculty,
                  attributes: ['id', 'name']
                }
              ]
            }
          ]
        },
      ]
    });
    res.json({ data });
  } catch (error) {
    console.error('getDocuments error', error);
    res.status(500).json({ message: 'Server error listing documents' });
  }
};

const getCourses = async (req, res) => {
  try {
    const course = await Course.findAll(
      {
        include: [
          {
            model: Department,
            attributes: ['id', 'name'],
            include: [
              {
                model: Faculty,
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      }
    )

    res.json({ data: course })
  } catch (error) {
    console.error('getCourses error', error);
    res.status(500).json({ message: 'Server error listing getCourses' });
  }
}

const getDocumentById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await DocumentHust.findByPk(id, {
      include: [
        { model: Course, attributes: ['id', 'name'], include: [{ model: Department, attributes: ['id', 'name'] }]},
        {
          model: User,
          attributes: ['id', 'username', 'avatar_url', 'email'] 
        }
      ]
    });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json({ data: doc });
  } catch (error) {
    console.error('getDocument error', error);
    res.status(500).json({ message: 'Server error fetching document' });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findOne({
      where: { id: userId }
    })
    res.json({ data: user });
  } catch (error) {
    console.error('getDocument error', error);
    res.status(500).json({ message: 'Server error fetching document' });
  }
};

const createRating = async (req, res) => {
  try {
    const { document_id, content, rating } = req.body;
    const user_id = req.user.id;
    if (!document_id || !content) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }
    const comment = await Comment.create({
      content,
      rating,
      user_id,
      document_id,
    });
     res.status(201).json({data:comment});
  } catch(error){
    console.error('rating error', error);
    res.status(500).json({ message: 'Server error fetching rating' });
  }
}

const getComment = async(req, res) =>{
  try {
    const { documentId } = req.params;
    const comments = await Comment.findAll({
      where: { document_id: documentId },
      include: [{ model: User, attFFributes: ['username', 'avatar_url'] }],
      order: [['createdAt', 'DESC']],
    });

    res.status(201).json({data:comments});
  } catch (error) {
    console.error('[getCommentsByDocument]', error);
    res.status(500).json({ message: 'Lỗi khi lấy comment', error });
  }
}

const reactToComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId, type } = req.body;

  if (!['like', 'dislike'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type' });
  }

  try {
    let existing = await CommentReaction.findOne({
      where: { comment_id: commentId, user_id: userId }
    });

    if (existing) {
      if (existing.type === type) {
        await existing.destroy();
      } else {
        existing.type = type;
        await existing.save();
      }
    } else {
      await CommentReaction.create({
        comment_id: commentId,
        user_id: userId,
        type
      });
    }

    const [likeCount, dislikeCount] = await Promise.all([
      CommentReaction.count({ where: { comment_id: commentId, type: 'like' } }),
      CommentReaction.count({ where: { comment_id: commentId, type: 'dislike' } })
    ]);
    await Comment.update(
      { like_count: likeCount, dislike_count: dislikeCount },
      { where: { id: commentId } }
    );

    res.json({ commentId, likeCount, dislikeCount });
  } catch (err) {
    console.error('React to comment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDocumentsByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const docs = await DocumentHust.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Course,
          include: [
            {
              model: Department,
              include: [Faculty],
            },
          ],
        },
        {
          model: User,
          attributes: ['id', 'username', 'email', 'avatar_url'],
        }
      ]
    });

    res.json({ data: docs });
  } catch (error) {
    console.error('Lỗi khi lấy tài liệu của người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
module.exports = {
  register,
  login,
  createDocumentByUser,
  updateDocumentByUser,
  deleteDocumentByUser,
  searchDocumentsByUser,
  filterDocuments,
  getDocuments,
  getDocumentById,
  getProfile,
  getCourses,
  createRating,
  getComment,
  reactToComment,
  getDocumentsByUser
}