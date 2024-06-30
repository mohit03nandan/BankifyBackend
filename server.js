const express = require('express');
const connect = require('./config/db');
const rootRouter = require('./routes/index');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Connection to database
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1', rootRouter);

app.get('/api/health', (req, res) => {
    res.send(`Backend server is active. Status: active & time: ${new Date()}`);
});

const port = process.env.PORT
const host = process.env.HOST
app.listen(port, () => {
    console.log(`Express server listening at http://${host}:${port}`);
});
