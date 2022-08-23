const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const positionSchema = mongoose.Schema({
    positionId:{type:String, required:true},
    positionName:{type:String, required:true},
    positionLevel:{type:Number, required:true},
    positionDate:{type:Date, required:false}
},{
    collection:'positions'
});
positionSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Positions',positionSchema);