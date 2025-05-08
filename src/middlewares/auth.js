const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try{
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Chưa đăng nhập' });
    }
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Token không tồn tại' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
        req.user = user; 
        next();
    });
    }catch(error){
        console.error("Authentication Error:", error.message);
        res.status(500).json({ message: 'Lỗi server khi xác thực token' });
    }
};

module.exports = { authenticateToken};
