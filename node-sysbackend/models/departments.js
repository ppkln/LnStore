const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const departSchema = mongoose.Schema({
    departId:{type:String, required:true},
    departName:{type:String, required:true},
    departDate:{type:Date, required:false}
},{
    collection:'departments'
});
departSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Departments',departSchema);