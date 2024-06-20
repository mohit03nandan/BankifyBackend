const express = require('express')
const connect = require('./config/db')
const app = express()
const cors = require('cors');

// connnection to database
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get("/api/health" ,(req,res) =>{
    res.send(`backend server is active status: active & time:${ new Date()}`)
})



const port = process.env.PORT || 3003;
const host = process.env.HOST || "localhost"
app.listen(port, () => {
    console.log(`Express server listening at http://${host}:${port}`)
})
