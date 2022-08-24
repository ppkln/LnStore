const express = require('express')
const backendRoute = express.Router();
const bcryptjs = require('bcryptjs');
const session = require('express-session');

const member = require('./../models/members');
const memLogin = require('./../models/memLogin');
const testUploadData = require('./../models/testUploadfile');// สำหรับทดสอบเขียนโปรแกรมเท่านั้น



// *************** middleware check login ***************
const IfNotLoggedIn = (req,res,next)=>{
    if(!req.session.LoginStatus){
        return res.redirect('/login')
    }
    next();
}
const IfLoggedIn = (req,res,next)=>{
    if(req.session.LoginStatus){
        return res.redirect("/profile/"+req.session.userObjId)
    }
    next();
}
// end middleware check login

//สำหรับอัพโหลดไฟล์ภาพสมาชิก
const multer = require('multer'); //เรียกใช้งาน multer
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'dist/image/img_members/')//ตำแหน่งจัดเก็บไฟล์ 
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+".jpg"); //เปลี่ยนชื่อไฟล์ ป้องกันชื่อซ้ำกัน
    }
})
//คำสั่งดำเนินการอัพไฟล์รูป
const maxSize = 2 * 1024 * 1024;//กำหนดขนาดภาพไม่เกิน 2 MB
const uploadImgMem = multer({
    storage:storage,
    limits: { fileSize: maxSize }
})
//สิ้นสุดคำสั่งการอัพไฟล์

// Register 
    //ฟังก์ชันย่อยในการบันทึกข้อมูลลง MongoDB
    const addMember = async memObj =>{
        const newmember = new member ({
            memberId:memObj.memId,
            email:memObj.email,
            fname:memObj.fname,
            lname:memObj.lname,
            sex:memObj.sex,
            phoneNumber:memObj.phoneNumber,
            imgMem:memObj.img,
            address:memObj.address,
            positionId:memObj.positionId,
            dateRegis:Date(),
            statusWork:true,
        })
        const data = newmember.save();
        console.log('บันทึกข้อมูลลง members ใน MongoDB สำเร็จ');

        const hash = await bcryptjs.hash(memObj.pws,10);
        const userLogin = new memLogin({
            memberId:memObj.memId,
            email:memObj.email,
            pws:hash,
            statusLogin:true
        })
        const data2 = await userLogin.save();
        console.log('บันทึกข้อมูลลง memLogin ใน MongoDB สำเร็จ');

        return data;
    }
    //สิ้นสุดฟังก์ชันย่อยในการบันทึกข้อมูลลง MongoDB

backendRoute.post('/register', uploadImgMem.single('file'),(req,res,next)=>{
    const email1= req.body.email;
    member.find({email:email1}).exec((err,doc)=>{ //ตรวจสอบว่ามี email นี้อยู่ในระบบแล้วหรือไม่
        if(err){
            console.log("มีข้อบกพร่องเกี่ยวกับการค้นหาข้อมูลเกิดขึ้น กรุณาแจ้งทีมงาน");
        } 
        else {
            const txt = req.body.email;
            const email = txt.toLowerCase();//ปรับให้ชื่อ email เป็นตัวพิมพ์เล็กทั้งหมด

            const memObj = {
                memId : req.body.memId,
                email : email,
                pws : req.body.pws,
                fname : req.body.fname,
                lname : req.body.lname,
                sex : req.body.sex,
                phoneNumber : req.body.phoneNumber,
                img : req.file?.filename,
                address : req.body.address,
                positionId : req.body.positionId,
            }
            console.log('ค่า memObj.pws');
            addMember(memObj)
            .then(data=>{
                console.log("เพิ่มข้อมูลสมาชิกใหม่ สำเร็จ (Successfully) _นี้คือข้อความจาก backendRoute.js");
                    res.status(201).json(data);
            })
            .catch(err=>{
                console.log("Sorry บันทึกข้อมูลสมาชิกใหม่ ไม่สำเร็จ  _นี้คือข้อความจาก backendRoute.js");
                res.status(500).json(err)
            })
        } 
    })
});

// ********* Login **********
backendRoute.post('/login',(req,res)=>{
        if(!req.body.email || !req.body.pws){
            res.redirect('/login');
            return ;
        }

        //ฟังก์ชัน checkLogin
        const checkLogin = async loginObj =>{
            const User = await memLogin.findOne({email:loginObj.email})
            if(!User){
                return {id:null, e_mail:null, LoginStatus:false}
            } else {
                const result = await bcryptjs.compare(loginObj.pws,User.pws)
                const idObjMem = await member.findOne({email:loginObj.email})
                if (idObjMem){
                    return {id:idObjMem._id, email:idObjMem.email, LoginStatus:result}
                } else {
                    return {id:null, e_mail:null, LoginStatus:false}
                }
            }
        }
        // จบ ฟังก์ชัน checkLogin

        let loginObj = {
            email:req.body.email,
            pws:req.body.pws
        }
        checkLogin(loginObj) // เรียกใช้ฟังก์ชันตรวจเช็คข้อมูลใน MongoDB
        .then(result=>{
            if(result.LoginStatus == true){
                req.session.userObjId = result.id
                req.session.email = result.email
                req.session.LoginStatus = result.LoginStatus
                req.session.cookie.maxAge= 3600*1000 //อายุของ session เท่ากับ 1 ชั่วโมง
                console.log("ผ่านการ Login")
                const sessLogin={
                    sessionUserObjID:req.session.userObjId,
                    sessionEmail:req.session.email,
                    sessionLoginStatus:req.session.LoginStatus
                }
                res.status(200).json(sessLogin);
            } else {
                console.log("Login ไม่ผ่าน ")
                const sessLogin={
                    sessionUserObjID:null,
                    sessionEmail:null,
                    sessionLoginStatus:false
                }
                res.status(500).json(sessLogin);
            }
        })
        .catch(err=>{
            console.log("เกิด error ในขั้นตอน Login (member.route.js) : "+ err)
        })
});

// getProfile 
backendRoute.get('/profile/:id',(req,res)=>{
    console.log("ค่าที่แนบมาพร้อม URL (backendRoute.get-id) : "+req.params.id)
    member.findOne({_id:req.params.id},(err,data)=>{
        if (err){
            console.log('ไม่พบข้อมูลสมาชิก');
            res.status(500).json(err);
        } else {
            console.log('ข้อมูลสมาขิก data._id = '+data._id);
            res.status(200).json(data);
        }
    })
})

// update Profile 
backendRoute.put('/update-member/:id',(req,res)=>{
    console.log("ค่า objectID ที่แนบมาพร้อม URL (backendRoute.put-id) : "+req.params.id)
    let data = req.body;
    console.log('ค่าของ data ที่ส่งแบบ body มา= '+data)
    member.findByIdAndUpdate({_id:req.params.id},data,{useFindAndModify:false}).exec((err,doc)=>{
        if(err){
            console.log('ปรับปรุงข้อมูลสมาชิก ไม่สำเร็จ');
            res.status(500).json(err);
        } else {
            console.log('ปรับปรุงข้อมูลสมาชิก สำเร็จ (Successfully)');
            res.status(200).json(doc);
        }
    })

});














// *** test upload file function ****
const testaddMember = async memObj =>{
    const testData = new testUploadData ({
        memberId:memObj.memId,
        email:memObj.email,
        fname:memObj.fname,
        lname:memObj.lname,
        sex:memObj.sex,
        phoneNumber:memObj.phoneNumber,
        imgMem:memObj.img,
        dateRegis:Date(),
        statusWork:true
    })
    const data = testData.save();
    console.log('บันทึกข้อมูลลง members ใน MongoDB สำเร็จ');

    return data;
}
// *** end test upload file function ****

backendRoute.post('/test-uploadfile', uploadImgMem.single('file'),(req,res)=>{
    console.log("อยู่ที่ backendRoute.post(/test-upload) แล้วและค่าของ req.body.email = "+req.body.email);
    console.log('ค่าของ req.file?.filename = '+req.file?.filename)
    const email1= req.body.email;
    member.find({email:email1}).exec((err,doc)=>{ //ตรวจสอบว่ามี email นี้อยู่ในระบบแล้วหรือไม่
        if(err){
            console.log("มีข้อบกพร่องเกี่ยวกับการค้นหาข้อมูลเกิดขึ้น กรุณาแจ้งทีมงาน");
        } 
        else {
            const txt = req.body.email;
            const email = txt.toLowerCase();//ปรับให้ชื่อ email เป็นตัวพิมพ์เล็กทั้งหมด

            const memObj = {
                memId : req.body.memId,
                email : email,
                pws : req.body.pws,
                fname : req.body.fname,
                lname : req.body.lname,
                sex : req.body.sex,
                phoneNumber : req.body.phoneNumber,
                img : req.file?.filename,
            }
            console.log('ค่า memObj.pws');
            testaddMember(memObj)
            .then(data=>{
                console.log("เพิ่มข้อมูลสมาชิกใหม่ สำเร็จ (Successfully) _นี้คือข้อความจาก backendRoute.js");
                    res.status(201).json(data);
            })
            .catch(err=>{
                console.log("Sorry บันทึกข้อมูลสมาชิกใหม่ ไม่สำเร็จ  _นี้คือข้อความจาก backendRoute.js");
                res.status(500).json(err)
            })
        // } else {
        //     console.log("มี e-mail นี้อยู่ในระบบแล้ว  _นี้คือข้อความจาก backendRoute.js");
        //     res.status(200).json({
        //         data:"มี e-mail นี้ในระบบแล้ว"
        //     })
        } 
    })
});


module.exports = backendRoute;