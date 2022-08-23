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
    cookie:{maxAge:3600*1000} // session อายุ 1 ชั่วโมง
}));

app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
//static directory path
app.use(express.static(path.join(__dirname,'dist/')))

//base route of backend
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'dist/index.html'));
});

//root API
app.use('/api',backendRoute);

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


//--------------------------------- route section------------------------------------------//

// const bcryptjs = require('bcryptjs');

// const member = require('./models/members');
// const memLogin = require('./models/memLogin');

// //สำหรับอัพโหลดไฟล์ภาพ
// const multer = require('multer'); //เรียกใช้งาน multer
// const { async } = require('rxjs');
// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join(__dirname,'dist/image/img_members/'))//ตำแหน่งจัดเก็บไฟล์
//     },
//     filename:function(req,file,cb){
//         cb(null,Date.now()+'.jpg') //เปลี่ยนชื่อไฟล์ ป้องกันชื่อซ้ำกัน
//     }
// })
// //คำสั่งดำเนินการอัพไฟล์รูป
// const uploadImgMem = multer({
//     storage:storage
// })
// //สิ้นสุดคำสั่งการอัพไฟล์

// // การ Register 
//     //ฟังก์ชันย่อยในการบันทึกข้อมูลลง MongoDB
//     const addMember = async memObj =>{
//         const hash = await bcryptjs.hash(memObj.pws,5);
//         const newmember = new member ({
//             memberId:memObj.memberId,
//             email:memObj.email,
//             fname:memObj.fname,
//             lname:memObj.lname,
//             sex:memObj.sex,
//             phoneNumber:memObj.phoneNumber,
//             imgMem:memObj.img,
//             address:memObj.address,
//             regisDate:memObj.regisDate,
//             departId:memObj.departId,
//             statusWork:memObj.statusWork,
//             dateRegis:memObj.dateRegis
//         })
//         const data = await newmember.save();
//         console.log('บันทึกข้อมูลลง members ใน MongoDB สำเร็จ');

//         // ทำการบันทึกข้อมูลลงใน collection ของ MongoDB สำหรับ Login ด้วย
//         const userLogin = new memLogin({
//             memberId:memObj.memberId,
//             email:memObj.email,
//             pwd:hash,
//             statusLogin:true
//         })
//         const data2 = await  userLogin.save();
//         console.log('บันทึกข้อมูลลง memLogin ใน MongoDB สำเร็จ');

//         return data; //บันทึกข้อมูลเสร็จแล้วทำการ retutn ค่า data ซึ่งเป็นผลลัพฑ์จากการบันทึกข้อมูลลง members ใน MongoDB สำเร็จ
//     }
//     //สิ้นสุดฟังก์ชันย่อยในการบันทึกข้อมูลลง MongoDB

// app.post('/register', uploadImgMem.single('img'),(req,res,next)=>{
//     console.log("ค่าของ req.body.email = "+req.body.email);
//     const email1= req.body.email;
//     member.find({email:email1}).exec((err,doc)=>{
//         if(err){
//             console.log("มีข้อบกพร่องเกี่ยวกับการค้นหาข้อมูลเกิดขึ้น กรุณาแจ้งทีมงาน");
//         } else if(doc == null) {
//             const txt = req.body.email;
//             const memberid = req.body.memberId;
//             const email = txt.toLowerCase();
//             const pwd = req.body.pwd;
//             const fname = req.body.fname;
//             const lname = req.body.lname;
//             const sex = req.body.sex;
//             const phoneNumber = req.body.phoneNumber;
//             const img = req.file.filename;
//             const address = req.body.address;
//             const departId = req.body.departId;
//             const statusWork = true;
//             const dateRegis = date();

//             const memObj = {
//                 memberId : memberid,
//                 email : email,
//                 pwd : pwd,
//                 fname : fname,
//                 lname : lname,
//                 sex : sex,
//                 phoneNumber : phoneNumber,
//                 img : img,
//                 address : address,
//                 departId : departId,
//                 statusWork : statusWork,
//                 dateRegis : dateRegis
//             }
//             addMember(memObj)
//             .then(data=>{
//                 console.log("เพิ่มข้อมูลสมาชิกใหม่ สำเร็จ (Successfully)");
//                     res.status(201).json(data);
//             })
//             .catch(err=>{
//                 console.log("Sorry บันทึกข้อมูลสมาชิกใหม่ ไม่สำเร็จ");
//                 res.status(500).json(err)
//             })
//         } else {
//             console.log("มี e-mail นี้อยู่ในระบบแล้ว");
//                 res.status(200).json({
//                     data:"มี e-mail นี้ในระบบแล้ว"
//                 })
//         }
//     })
// });


