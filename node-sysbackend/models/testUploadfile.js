const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const testUploadSchema = mongoose.Schema({
    memberId:{type:String, require:true},
    email:{type:String, require:true, unique:true},
    fname:{type:String, require:true},
    lname:{type:String, require:true},
    sex:{type:String, require:false},
    phoneNumber:{type:String, require:false},
    imgMem:{type:String, require:false},
    dateRegis:{type:String, require:false},
    statusWork:{type:Boolean, require:false}
},{versionKey: false});
testUploadSchema.plugin(uniqueValidator);
module.exports = mongoose.model('TestuploadFile',testUploadSchema);
