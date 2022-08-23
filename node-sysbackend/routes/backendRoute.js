const express = require('express')
const backendRoute = express.Router();
const bcryptjs = require('bcryptjs');

const member = require('./../models/members');
const memLogin = require('./../models/memLogin');
const testUploadData = require('./../models/testUploadfile');



//สำหรับอัพโหลดไฟล์ภาพ
const multer = require('multer'); //เรียกใช้งาน multer
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'dist/image/img_members/')//ตำแหน่งจัดเก็บไฟล์ 
    },
    filename:function(req,file,cb){
        console.log('ชื่อไฟล์ภาพใหม่ (multer) คือ :'+Date.now()+'.jpg');
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
        // } else {
        //     console.log("มี e-mail นี้อยู่ในระบบแล้ว  _นี้คือข้อความจาก backendRoute.js");
        //     res.status(200).json({
        //         data:"มี e-mail นี้ในระบบแล้ว"
        //     })
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