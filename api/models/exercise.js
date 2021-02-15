'use strict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ExerciseSchema=Schema({
text:String,
name:String,
category:String,
file:String,
filev:String,
created_at:String,
user:{type:Schema.ObjectId,ref:'User'}
});
module.exports=mongoose.model('Exercise',ExerciseSchema);
