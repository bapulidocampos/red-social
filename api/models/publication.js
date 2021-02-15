'use strict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var PublicationSchema=Schema({
text:String,
file:String,
filev:String,
comentario:{type:Schema.ObjectId,ref:'Comentary'},
created_at:String,
user:{type:Schema.ObjectId,ref:'User'}
});
module.exports=mongoose.model('Publication',PublicationSchema);

