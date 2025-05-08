require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes)

sequelize
    .authenticate()
    .then(() =>{
        console.log('Database connected successfully');
        return sequelize.sync();
    })
    .then(() =>{
        console.log('Models synced successfully');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    })
    .catch(err =>{
        console.error('Database connection error:', err);
    })
