const sequelize    = require('../config/database');
const Faculty        = require('./Faculty');
const Department     = require('./Department');
const Course         = require('./Course');
const DocumentHust   = require('./DocumentHust');

Faculty.hasMany(Department,   { foreignKey: 'faculty_id' });
Department.belongsTo(Faculty, { foreignKey: 'faculty_id' });

Department.hasMany(Course,     { foreignKey: 'department_id' });
Course.belongsTo(Department,   { foreignKey: 'department_id' });

Course.hasMany(DocumentHust,   { foreignKey: 'course_id' });
DocumentHust.belongsTo(Course, { foreignKey: 'course_id' });

sequelize.sync();

module.exports = {
  Faculty,
  Department,
  Course,
  DocumentHust,
};
