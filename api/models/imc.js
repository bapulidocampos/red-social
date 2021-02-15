
'use strict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ImcSchema=Schema({
peso:String,
altura:String,
imc:String,
tmb:String,
file:String,
filev:String,
created_at:String,
user:{type:Schema.ObjectId,ref:'User'}
});
module.exports=mongoose.model('Imc',ImcSchema);

/*
'use strict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ImcSchema=Schema({
text:String,
name:String,
category:String,
file:String,
filev:String,
created_at:String,
user:{type:Schema.ObjectId,ref:'User'}
});
module.exports=mongoose.model('Imc',ImcSchema);
*/
