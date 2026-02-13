require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const jobRoutes = require('./routes/jobRoutes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorMiddleware } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>JobBridge API</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; }
          h1 { color: #4F46E5; }
          p { font-size: 18px; }
          a { background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          a:hover { background-color: #4338ca; }
        </style>
      </head>
      <body>
        <h1>JobBridge Backend API is Running</h1>
        <p>You are currently accessing the Backend API server.</p>
        <p>To view the <b>JobBridge Frontend</b> (User Interface), please click the button below:</p>
        <br>
        <a href="http://localhost:5173">Go to JobBridge Frontend</a>
      </body>
    </html>
  `);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/jobs', jobRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

// Sync Database and Start Server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected & synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
