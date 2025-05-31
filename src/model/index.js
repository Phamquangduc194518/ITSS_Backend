const Faculty        = require('./Faculty');
const Department     = require('./Department');
const Course         = require('./Course');
const DocumentHust   = require('./DocumentHust');
const User = require('./User');
const Comment = require('./Comment');

Faculty.hasMany(Department,   { foreignKey: 'faculty_id' });
Department.belongsTo(Faculty, { foreignKey: 'faculty_id' });

Department.hasMany(Course,     { foreignKey: 'department_id' });
Course.belongsTo(Department,   { foreignKey: 'department_id' });

Course.hasMany(DocumentHust,   { foreignKey: 'course_id' });
DocumentHust.belongsTo(Course, { foreignKey: 'course_id' });

Course.hasMany(DocumentHust,   { foreignKey: 'course_id' });
DocumentHust.belongsTo(Course, { foreignKey: 'course_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

DocumentHust.hasMany(Comment, { foreignKey: 'document_id' });
Comment.belongsTo(DocumentHust, { foreignKey: 'document_id' });

User.hasMany(DocumentHust, { foreignKey: 'user_id' });
DocumentHust.belongsTo(User, { foreignKey: 'user_id' });


module.exports = {
  Faculty,
  Department,
  Course,
  DocumentHust,
  User,
  Comment
};
