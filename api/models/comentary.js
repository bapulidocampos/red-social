'use strict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ComentarySchema=Schema({
file:String,
filev:String,
comentario:String,
created_at:String,
publicatione:{type:Schema.ObjectId,ref:'Publication'},
user:{type:Schema.ObjectId,ref:'User'}
});
module.exports=mongoose.model('Comentary',ComentarySchema);  