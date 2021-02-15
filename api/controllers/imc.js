'use strict'
var path=require('path');
var fs=require('fs');
var moment=require('moment');
var mongoosePaginate=require('mongoose-pagination');
var Imc=require('../models/imc');
var User=require('../models/User');
var Follow=require('../models/follow');

function probando (req,res){
	res.status(200).send({
		message:'hola desde el controlador publication'
	});
}




function savePublication(req,res){
	var params=req.body;
	
//si no me llega el parametro texto
	if(!params.peso) return res.status(200).send({message:'Debes enviar un texto'});
var imc=new Imc();
//imc.text=params.text;
//imc.name=params.name;
//imc.category=params.category;
imc.peso=params.peso;
imc.altura=params.altura;
imc.imc=params.imc;
imc.tmb=params.tmb;
imc.file='null';
imc.filev='null';
imc.user=req.user.sub;
imc.created_at=moment().unix();
imc.save((err,imcStored)=>{

	if(err)return res.status(500).send({message:'error al guarda la publicacion'});
	if(!imcStored)return res.status(404).send({message:'la publicacion no se ha guardado'});
return res.status(200).send({
	imc:imcStored
});

});


}


//BUSCAR LAS PUBLICACIONES DE LOS USUARIOS QUE SEGUIMOS

function getPublications(req,res){
var page=1;
if(req.params.page){
	page=req.params.page;
}
var itemsPerPag=4;
Follow.find({user:req.user.sub}).populate('followed').exec((err,follows)=>{
if(err)return res.status(500).send({message:'error al devolver el seguimiento'});

var follow_clean=[];
follows.forEach((follow)=>{
	//para añadir el id pero estoy trayendo completo el objeto
follow_clean.push(follow.followed);
});

//añadimos nuestras publicaciones 
follow_clean.push(req.user.sub);


console.log(follow_clean);
//buscar con $in buscar dentro de un array , buscar las coincidencia
//buscar todos los documentos cuyo usuario este contenido en el array follow_clean
//sort ordena las publicaciones de mas nuevas a mas viejas
Imc.find({user:{"$in":follow_clean}}).sort('-created_at').populate('user').
paginate(page,itemsPerPag,(err,imcs,total)=>{
if(err)return res.status(500).send({message:'error al devolver publicaciones'});
if(!imcs)return res.status(404).send({message:'No hay publicaciones'});
return res.status(200).send({
	total_items:total,
	pages:Math.ceil(total/itemsPerPag),
	page:page,
	items_per_pag:itemsPerPag,
	imcs

});

});

});




}
////////////////////
//TODAS LAS PUBLICACIONES QUE TIENE SOLO UNA PERSONA
//-----------------------------------------------
// getPublicationsUser  por alguna razon no me deja este nombre

function getPublicationss(req,res){
var page=1;
if(req.params.page){
	page=req.params.page;
}
var user=req.user.sub;
if(req.params.user){
 user=req.params.user;
}
var itemsPerPag=4;
//var ext_split=file_name.split('\.');
//var file_ext=ext_split[1];
//console.log(publications[0]);
Imc.find({user:user}).sort('-created_at').populate('user').
paginate(page,itemsPerPag,(err,imcs,total)=>{
if(err)return res.status(500).send({message:'error al devolver publicaciones'});
if(!imcs)return res.status(404).send({message:'No hay publicaciones'});
return res.status(200).send({
	total_items:total,
	pages:Math.ceil(total/itemsPerPag),
	page:page,
	items_per_pag:itemsPerPag,
	imcs

});

});

}
//

function getPublicationsss(req,res){
	
var page=1;
if(req.params.page){
	page=req.params.page;
}
var user=req.user.sub;
if(req.params.user){
 user=req.params.user;
}
var itemsPerPag=4;
//var ext_split=file_name.split('\.');
//var file_ext=ext_split[1];
//console.log(publications[0]);
Exercise.find({user:user,category:'bicep'}).sort('-created_at').populate('user').
paginate(page,itemsPerPag,(err,exercises,total)=>{
if(err)return res.status(500).send({message:'error al devolver publicaciones'});
if(!exercises)return res.status(404).send({message:'No hay publicaciones'});

return res.status(200).send({
	total_items:total,
	pages:Math.ceil(total/itemsPerPag),
	page:page,
	items_per_pag:itemsPerPag,
	exercises

});

});

}




//---------------



//-----------------------------------------

function getPublication(req,res){

	var imcId=req.params.id;
	Imc.findById(imcId,(err,imc)=>{
if(err)return res.status(500).send({message:'error al devolver publicaciones'});
if(!imc)return res.status(500).send({message:'No existe la publicacion'});
return res.status(200).send({imc});

	});
}

function deletePublication(req,res){
var imcId=req.params.id;
Imc.find({'user':req.user.sub,'_id':imcId}).remove(err=>{
if(err)return res.status(500).send({message:'error al borrar publicacion'});
//if(!publicationRemoved)return res.status(500).send({message:'No se ha borrado la publicacion'});
return res.status(200).send({message:'imc  eliminada'});

	});

}



//subir imagen AVATAR DE USUARIO

function uploadImage(req,res){
var imcId=req.params.id;

//cuando abrimo la req hay una propiedad file
//si eexiste file o estamos enviando algiun fichero
if(req.files){
	//es todo el archivo que hemos subido
	console.log("por aquuiiiii   "+req.files);
var file_path=req.files.image.path;
console.log("file_path aquii1 2 "+file_path);
//separa el vector por //
var file_split=file_path.split('\\');
//squedaria 0(upload) 1(user) 2(la ruta o nombre del fichero)
console.log(file_split);
//para guardar el nombre del fichero
var file_name=file_split[2];
console.log(file_name);
//sacar que tipo es archivo .
//si es una imagen o otro tipo de archivo
//punto es un caracter especial debo usar la barra invertida
var ext_split=file_name.split('\.');
var file_ext=ext_split[1];
console.log(ext_split);
console.log(file_ext);


		if(file_ext=='png'||file_ext=='jpg'||file_ext=='jpeg'||file_ext=='gif'||file_ext=='mp4'){
			

			Imc.findOne({'user':req.user.sub,'_id':imcId}).exec((err,imc)=>{

				if(imc){


					if(file_ext=='mp4'){

						Imc.findByIdAndUpdate(imcId,{filev:file_name},{new:true},(err,imcUpdated)=>{
				if(err) return res.status(500).send({message:'Error en la peticion'});
if(!imcUpdated) return res.status(500).send({message:'No se ha podido actualizar el usuario'});
return res.status(200).send({imc:imcUpdated,file_ext});
			});

					}
else{

	Imc.findByIdAndUpdate(imcId,{file:file_name},{new:true},(err,imcUpdated)=>{
				if(err) return res.status(500).send({message:'Error en la peticion'});
if(!imcUpdated) return res.status(500).send({message:'No se ha podido actualizar el usuario'});
return res.status(200).send({imc:imcUpdated,file_ext});
			});

}

				}
				else{
					return removeFileOfUpload(res,file_path,'No tienes permiso para actualizar esta publicacion');
				}

			});

		
		
		}
			else{
//					eliminr el fichero
			return removeFileOfUpload(res,file_path,'la extension no valida');
			}


	}
	else{
		return res.status(200).send({message:'no se han subidos archivos o imagenes'});
	}

}

function getImageFile(req,res){
	//recoger por la url
	//el nombre de fichero que le vamos a pasar por la url
	//va recibir el metodo y va sacar esa imagen del sistemas de fichero
	var image_file=req.params.imageFile;
	//va tener el path de las imagenes de usuario
	var path_file='./uploads/imc/'+image_file;
	//comprabamos si el fichero existe
	fs.exists(path_file,(exists)=>{
		if(exists){
			//metodo de express para respuestas
			//devolver el fichero en crudo
			res.sendFile(path.resolve(path_file));
		}
		else{
			res.status(200).send({message:'no existe la imagen'});
		}
	});

}
function removeFileOfUpload(res,file_path,message){
	fs.unlink(file_path,(err)=>{
	return res.status(200).send({message:message});

}); 
}


module.exports={
	probando,
	savePublication,
	getPublications, 
	getPublication,
	deletePublication,
	uploadImage,
	getImageFile,
	getPublicationss,
	getPublicationsss
}