'use strict'

'use strict'
var path=require('path');
var fs=require('fs');
var moment=require('moment');
var mongoosePaginate=require('mongoose-pagination');
var Publication=require('../models/publication');
var User=require('../models/User');
var Follow=require('../models/follow');
var Message=require('../models/message');

function probando (req,res){
	res.status(200).send({
		message:'hola desde el controlador message'
	});
}

function saveMessage(req,res){

var params=req.body;
if(!params.text || !params.receiver) return res.status(200).send({
	message:'envia los datos necesarios'});
var message=new Message();
message.emitter=req.user.sub;
message.receiver=params.receiver;
message.text=params.text;
message.created_at=moment().unix();
message.viewed='false';
console.log(message);

message.save((err,messageStored)=>{
if(err) return res.status(500).send({message:'error en la peticion'});
if(!messageStored) return res.status(500).send({message:'error al enviar el mensaje'});
 return res.status(200).send({message:messageStored});


});

}

//los mensajes que hemos recivido

function getReceivedMessage(req,res){
var userId=req.user.sub;
var page=1;
if(req.params.page){
	var page=req.params.page;
}
var itemsPerPag=4;

//solo me devuela del usuaruio name surrname id

Message.find({receiver:userId}).sort('-created_at').populate('emitter','name surname _id image nick').paginate(page,itemsPerPag,(err,messages,total)=>
{
	if(err) return res.status(500).send({message:'error en la peticion'});
	if(!messages) return res.status(404).send({message:'No hay mensajes'});
	return res.status(200).send({total:total,
		pages:Math.ceil(total/itemsPerPag),
		messages

	});
});


}
//Mensjaes que hemos enviados
function getEmmitMessage(req,res){
var userId=req.user.sub;
var page=1;
if(req.params.page){
	var page=req.params.page;
}
var itemsPerPag=4;

//solo me devuela del usuaruio name surrname id
Message.find({emitter:userId}).sort('-created_at').populate('emitter receiver','name surname _id image nick').paginate(page,itemsPerPag,(err,messages,total)=>
{
	if(err) return res.status(500).send({message:'error en la peticion'});
	if(!messages) return res.status(404).send({message:'No hay mensajes'});
	return res.status(200).send({total:total,
		pages:Math.ceil(total/itemsPerPag),
		messages
    
	});
});


}

//mensajes sin leer
function getUnviewedMessage(req,res){

	var userId=req.user.sub;
	Message.count({receiver:userId,viewed:false}).exec((err,count)=>{
	if(err) return res.status(500).send({message:'error en la peticion'});
	
	return res.status(404).send({'unviewed':count});
	});
}

//mensajes leidos
function setViewedMessage(req,res){
var userId=req.user.sub;
//con el multi hacemos  actualizar todos los documentos
//si no tiene mutli actualiza uno
Message.update({receiver:userId,viewed:'false'},{viewed:'true'},{"multi":true},(err,messageUpdated)=>{
if(err) return res.status(500).send({message:'error en la peticion'});
//if(!messageUpdated) return res.status(404).send({message:'no se han podido'});
return res.status(200).send({messages:messageUpdated});

});


}
module.exports={
	probando,saveMessage,getReceivedMessage,getEmmitMessage,getUnviewedMessage,setViewedMessage
}