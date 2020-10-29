const express = require('express')
const mongoose =require('mongoose')
const dotenv =require('dotenv')
const bodyparser = require('body-parser')
const userRoute = require('./routes/userRouter')
const cors = require('cors')
const morgan = require('morgan')


dotenv.config()

const app = express()
app.use(bodyparser.json())

app.use(cors());
app.use(morgan('combined'));


const PORT = process.env.PORT || 8080

mongoose.connect(`uri${process.env.DB_CONNECTION}` ,{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true
}, (err) =>{
    if (err) throw err;
    console.log('Database Connection Established')
})

app.use('/api/users' , userRoute)

app.listen(8080 , (req,res) => { 
    console.log(`listning to port ${PORT}`);
})