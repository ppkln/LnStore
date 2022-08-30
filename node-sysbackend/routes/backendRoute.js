const express = require('express')
const backendRoute = express.Router();
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const secretkeyln='r22kjhjkhkjsdf65sdf5dfg';
const fs = require('fs');

const member = require('./../models/members');
const memLogin = require('./../models/memLogin');
const testUploadData = require('./../models/testUploadfile');// สำหรับทดสอบอัพไฟล์เท่านั้น



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

// *********** function delete image member *******
const deleteImageMember = async nameFileDelete =>{
    const fileToBeRemoved = 'dist/image/img_members/'+nameFileDelete;

    await fs.unlink(fileToBeRemoved, (err)=> {
        if(err && err.code == 'ENOENT') {
            // ไม่มีไฟล์ดังกล่าวอยู่ในระบบ
            console.info("ไม่พบไฟล์ที่ต้องการลบ");
        } else if (err) {
            // อาจจเกิดข้อผิดพลาดอื่นๆ เช่น ไม่มีสิทธิ์ในการลบไฟล์
            console.error("เกิดข้อผิดพลาดขณะทำการลบไฟล์");
        } else {
            console.log("ลบไฟล์สำเร็จ (Deleted successfully)");
        }
    });
    return ;
}
// *********** end function delete image member *******

// ******  Register Member ***********
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
        const data = await newmember.save();
        console.log('บันทึกข้อมูลลง members ใน MongoDB สำเร็จ');

        const hash = await bcryptjs.hash(memObj.pws,10);
        const userLogin = new memLogin({
            memberId:memObj.memId,
            email:memObj.email,
            pws:hash,
            levelWork:1,
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
// ****** End Register Member ***********

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
                    let token = jwt.sign({email:idObjMem.email,levelWork:User.levelWork},secretkeyln);
                    return {id:idObjMem._id, email:idObjMem.email, LoginStatus:result, token}
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
                console.log("ผ่านการ Login")
                const sessLogin={
                    sessionUserObjID:req.session.userObjId,
                    sessionEmail:req.session.email,
                    sessionLoginStatus:req.session.LoginStatus,
                    token:result.token
                }
                res.status(200).json(sessLogin);
            } else {
                console.log("Login ไม่ผ่าน ")
                const sessLogin={
                    sessionUserObjID:null,
                    sessionEmail:null,
                    sessionLoginStatus:false,
                    token:''
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
    member.findOne({_id:req.params.id},(err,data)=>{
        if (err){
            console.log('ไม่พบข้อมูลสมาชิก');
            res.status(500).json(err);
        } else {
            res.status(200).json(data);
        }
    })
})
// get Profile List
backendRoute.get('/profile-list',(req,res)=>{
    member.find({},(err,data)=>{
        if(err){
            console.log('ไม่พบข้อมูลสมาชิก (profile-list)');
            res.status(500).json(err);
        } else {
            res.status(200).json(data);
        }
    })
})

// update Profile 
backendRoute.put('/update-member/:id',(req,res)=>{
    let data = req.body;
    member.findByIdAndUpdate({_id:req.params.id},data).exec((err,doc)=>{
        if(err){
            console.log('ปรับปรุงข้อมูลสมาชิก ไม่สำเร็จ');
            res.status(500).json(err);
        } else {
            console.log('ปรับปรุงข้อมูลสมาชิก สำเร็จ (Successfully)');
            res.status(200).json(doc);
        }
    })
});

// *****  Delete Member **********
backendRoute.delete('/delete-member/:email', (req,res,next)=>{
    member.findOneAndRemove({email:req.params.email},(err,doc)=>{
        if(err){
            return next(err)
        } else {
            memLogin.findOneAndRemove({email:req.params.email},(err,docc)=>{
                if (err){
                    return next(err)
                } else{
                    const imgname = doc.imgMem
                    deleteImageMember(imgname);
                    res.status(200).json({msg:doc});
                }
            })
        }
    })
    
})










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