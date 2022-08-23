const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const memberSchema = mongoose.Schema({
    memberId:{type:String, require:true},
    email:{type:String, require:true, unique:true},
    fname:{type:String, require:true},
    lname:{type:String, require:true},
    sex:{type:String, require:false},
    phoneNumber:{type:String, require:false},
    imgMem:{type:String, require:false},
    address:{type:String,require:false},
    positionId:{type:String, require:false},
    dateRegis:{type:String, require:false},
    statusWork:{type:Boolean, require:false},
},{versionKey: false});
memberSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Members',memberSchema);
