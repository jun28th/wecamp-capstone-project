import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import User from './models/User.js';
import userRoutes from './routes/user.routes.js';
const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/users', userRoutes);
// const express = require('express');
// const cors = require('cors');
// const itemRoutes = require('./routes/item.routes');
// const errorHandler = require('./middlewares/errorHandler');

// const app = express();
// app.use(cors());
// app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Backend đang chạy!');
});

// app.use('/api/items', itemRoutes);

// app.use(errorHandler); 
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({force:true}); // This create a new table if it doesn't exist (and does nothing if it already exists)
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
        // Create a new user
    // const jane = await User.create({ firstName: 'Jane', lastName: 'Doe' });
    // console.log("Jane's auto-generated ID:", jane.id);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Khởi chạy server
startServer();