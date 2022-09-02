const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const app = express();

const backendRoute = require("./routes/backendRoute");

app.use(session({
    secret:"mykeySessionLN",
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:60*1000} // session อายุ 10 นาที
}));

app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
// app.use(cookieParser());
app.use(cors());
//static directory path
app.use(express.static(path.join(__dirname,'dist/')))

// loggin middleware
app.use((req,res,next)=>{
    console.info(req.method+ '-'+req.url);
    next();
})

//base route of backend
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'dist/index.html'));
});


//root API
app.use('/api', backendRoute);


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/LnStore',{useNewUrlparser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch(()=>{
    console.log('Cannot connect to MongoDB');
})

const port = process.env.port || 8000 ; // กำหนดเลข port ที่ใช้เชื่อมต่อกับ express คือ port : 8000 

app.listen(port,()=>{
    console.log('Connected to Back-end server on port : ',port)
})

app.use((err,req,res,next)=>{
    console.log('นี้คือข้อความจาก Express server: '+err.message)
    if(!err.statusCode) err.statusCode = 500
    res.status(err.statusCode).send('Error handle จาก express server : '+err.message)
})




