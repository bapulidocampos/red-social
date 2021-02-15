'use strict'
//var path=require('path');
//var fs=require('fs');
var mongoosePaginate=require('mongoose-pagination');
var User=require('../models/User');
var Follow=require('../models/follow');

function saveFollow(req,res){
var params=req.body;

var follow=new Follow();
//por que . la propiedad user del objeto req
//e adjuntado a la hora de hacer la autentificacion
//un objeto con todo el  usuario logueado
follow.user=req.user.sub;
follow.followed=params.followed;
follow.save((err,followStored)=>{
	if(err) return res.status(500).send({
		message:'erro al guardar el seguimiento'});
	if(!followStored) return res.status(404).send({
			message:'el seguimiento no se ha guardado'});

	return res.status(200).send({follow:followStored});
});

}

function deleteFollow(req,res){
//el usuario que esta logueado
	var userId=req.user.sub;
	//el usuario al que vamos dejar de seguir 
	//pasarlo por la url
	var followId=req.params.id;

	Follow.find({'user':userId,'followed':followId}).remove(err=>{
			if(err) return res.status(500).send({
		message:'error al dejar de seguir'});
				return res.status(200).send({
					message:'el follow se ha eliminado'});
		});


}
/////////////////////////////////////////
//---------------------------------------------------------------------------------------------------------------
//LISTADO PAGINADO DE LOS USUARIOS QUE SEGUIMOS
function getFollowUsers(req,res){
	//usuario logueado
var userId=req.user.sub;
//en el caso que llegue un usuario por url
//va hacer prioritario
//en el caso que no llegue nada , vamos hacerlo con el userId 

if(req.params.id && req.params.page){
	userId=req.params.id;
}

var page=1;
//si nos llegara una pagina por la url
if(req.params.page){
	page=req.params.page;
}
else{
	page=req.params.id;
}
//listar 4 usuarios por pagina
var itemPerPage=4;
//buscar todos los usuarios que estoy siguiendo
//populate cambiar el objetct id por el documento 
//inidcandole que yo quiero cambiar por el objeto

Follow.find({user:userId}).populate({path:'followed'}).paginate(page,itemPerPage,(err,follows,total)=>{
if(err) return res.status(500).send({
		message:'error en el servidor'});
	if(!follows) return res.status(404).send({
		message:'no esta siguiendo ningun usuario'});
console.log(follows);
console.log(userId);
 //followUserIds(req.user.sub).then((value)=>{
 	followUserIds(userId).then((value)=>{
		return res.status(200).send({
		total:total,
		pages:Math.ceil(total/itemPerPage),
		follows,
		users_following:value.following,
		users_follow_me:value.followed
		});
	});

});



}

 async function followUserIds(user_id){
     
    var following = await Follow.find({'user':user_id}).select({'_id':0,'__v':0,'user':0}).exec()
    .then((follows) => {
    return follows;
    })
    .catch((err) => {
    return handleError(err);
    });
    var followed = await Follow.find({followed:user_id}).select({'_id':0,'__v':0,'followed':0}).exec()
    .then((follows) => {
    return follows;
    })
    .catch((err) => {
    return handleError(err);
    });
     
    var following_clean = [];
     
    following.forEach((follow)=>{
    following_clean.push(follow.followed);
    });
    var followed_clean = [];
     
    followed.forEach((follow)=>{
    followed_clean.push(follow.user);
    });
    //console.log(following_clean);
    return {following: following_clean,followed:followed_clean}
     
    }

//------------------------------------------------------------------------------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++











//------+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++





//LISTADO PAGINADO DE LOS USUARIOS QUE NOS ESTAN SIGUIENDO (SEGUIDORES)

function getFollowedUsers(req, res){
    var userId = req.user.sub;
 
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
 
    var page = 1;
    
    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }

    var itemsPerPage = 4;
 
    Follow.find({'followed':userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message: 'Error en el servidor'});
 
        if(!follows) return res.status(404).send({message: 'No te sigue ningun usuario'});
 
console.log(follows);
      
           	followUserIds(userId).then((value)=>{
		return res.status(200).send({
		total:total,
		pages:Math.ceil(total/4),
		follows,
		users_following:value.following,
		users_follow_me:value.followed
		});
	});

       
    });
}
//DEVOLVER LISTADO USUARIOS
//LISTAR DE MANERA CLARO LOS QUE SIGO
function getMyFollow(req,res){
	var userId=req.user.sub;
var followed=req.params.followed;
var find=Follow.find({user:userId});
if(req.params.followed){
find=Follow.find({followed:userId});

}

find.populate('user followed').exec((err,follows)=>{
  if(err) return res.status(500).send({message: 'Error en el servidor'});
 
        if(!follows) return res.status(404).send({message: 'No sigues ningun usuario'});

  return res.status(200).send({follows});

});
}



module.exports={saveFollow,deleteFollow,getFollowUsers,getFollowedUsers,getMyFollow}



/*

eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjRlNWZjMTMwYWE1ODE5YzBkZGU2MWUiLCJuYW1lIjoiYnJhaWFhbjQiLCJuaWNrIjoiYmFwdWxpZG80Iiwic3VybmFtZSI6InB1bGlkbzQiLCJlbWFpbCI6ImJyYWlhYW5wdWxpZG80QGhvdG1haWwuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImltYWdlIjpudWxsLCJpYXQiOjE1OTg5NzE5NDd9.zFGX5BjmAk-jdq3I5ePISG6s1SQjzPN3qLG2BiFEwl4

*/


