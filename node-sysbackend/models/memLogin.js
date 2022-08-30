const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const memLoginSchema = mongoose.Schema({
    memberId:{type:String, require:true},
    email:{type:String, require:true, required:true},
    pws:{type:String, require:true},
    levelWork:{type:Number},
    statusLogin:{type:Boolean, require:true}
},{versionKey: false});
memLoginSchema.plugin(uniqueValidator);
module.exports = mongoose.model('MemLogin',memLoginSchema);