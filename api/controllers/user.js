'use strict'
//en mayuscula para indicar que es un modelo
var User=require('../models/User');
var Publication=require('../models/publication');
var bcrypt=require('bcrypt-nodejs')
//llamo al servicio jwt
var jwt=require('../services/jwt');
var Follow=require('../models/follow');
//cargar el modulo paginate
var mongoosePaginate=require('mongoose-Pagination');
//importamo la libreria fs(fail system de node) nos permite trabajar ocn archivos
var fs=require('fs');
//nos permite trabajar con rutas de ficheros
var path=require('path');

function home(req,res){
	res.status(200).send({
		message:'Hola mundo'
	});
}

function pruebas(req,res){
	console.log(req.body);
	res.status(200).send({
		message:'accion de pruebas del servidor'
	});
}

function saveUser(req,res){
	//tomar lo que nos llega de post los vamos agarrar en la variable param
	var params=req.body;
	//creamos una instancia de usuario
	var user=new User();
	if(params.name && params.surname && params.nick && params.email && 
		params.password){
		user.name=params.name;
	user.surname=params.surname;
	user.nick=params.nick;
	user.email=params.email;
user.role='ROLE_USER';
user.image=null;
//buscamos que no este repetido
//busqueme entre todos si este email o nick existe
User.find({ $or: [
	{email:user.email.toLowerCase()},
	{nick:user.nick.toLowerCase()}
	]}).exec((err,users)=>{
		if(err)return res.status(500).send({
		message:'error en la peticion de usuarios'});
			if(users && users.length>=1){
				//retorna para que no compile mas codigo
				return res.status(200).send({
				message:'El usuario que intentas registrar ya existe'
				});
			}
			else{

	//cambiamos el null por otro hash.. un hash en otro hash para fortelecer la contraseña
bcrypt.hash(params.password,null,null,(err,hash)=>{
user.password=hash;
user.save((err,userStored)=>{
	if(err)return res.status(500).send({
		message:'error al guardar el usuario'
	});
		if(userStored){
			res.status(200).send({user:userStored});
		}
		else{
			res.status(404).send({
		message:'No se ha registrado el usuario'
	});
		}
});
});

			}
	});


	}else{
		res.status(200).send({
			message:'llena todos los campos necesarios'

		});
	}


}


function loginUser(req,res){
var params=req.body;

var email=params.email;
var password=params.password;
//AND que coincida el email con el email que llega y lo mismo con la password
User.findOne({email:email},(err,user)=>{
	if(err) return res.status(500).send({
		message:'error en la peticion'});
		if(user){
			//si hay usuario, compara si es correcta la contraseña(password(post),)
			//password(que esta guardada en la base de datos)
			bcrypt.compare(password,user.password,(err,check)=>{
				if(check){
					//devolver un token para saber si 
					if(params.gettoken){
						//o devolver los datos del usuario en hash con TOKEN
						//generary devolver el  token
						return res.status(200).send({
							token:jwt.createToken(user)
						});
					}
					else{
							//devolver los datos de los usuario en claro
						user.password=undefined;
					//si check es correcto .devolver datos de usuarios
					return res.status(200).send({user});
					
					}

					
				}else{
					//sino  devuelvo un error
					return res.status(404).send({
		message:'el usuario no se ha podido identioficar'});
				}

			});
		}
		else{
			return res.status(404).send({
		message:'el usuario no se ha podido identificar !!'});
		}
});



}
/*
//DE MANERA TRADICIONAL 
//devolver los datos de un usuario
function getUser(req,res){
	//llegan datos de la url se usa params
	//llegan datos post o put usamos body
	var userId=req.params.id;
	User.findById(userId,(err,user)=>{
if(err) return res.status(500).send({message:'error en la peticion'});
//si el usuario no nos llega
if(!user) return res.status(404).send({message:'usuario no existe'});
return res.status(200).send({user});
	});
}

*/

/*
//devolver los datos de un usuario
function getUser(req,res){
	//llegan datos de la url se usa params
	//llegan datos post o put usamos body

	var userId=req.params.id;
	User.findById(userId,(err,user)=>{
if(err) return res.status(500).send({message:'Error en la peticion'});
//si el usuario no nos llega
if(!user) return res.status(404).send({message:'Usuario no existe'});

Follow.findOne({'user':req.user.sub,'followed':userId}).exec((err,follow)=>{
	if(err) return res.status(500).send({message:'Error al comprobar el seguimiento'});

	return res.status(200).send({user,follow});
});


	});
}
*/



//devolver los datos de un usuario
function getUser(req,res){
	//llegan datos de la url se usa params
	//llegan datos post o put usamos body

	var userId=req.params.id;
	User.findById(userId,(err,user)=>{
if(err) return res.status(500).send({message:'Error en la peticion'});
//si el usuario no nos llega
if(!user) return res.status(404).send({message:'Usuario no existe'});
//llamamos la funcion ... como el asinc nos devuelve una promesa
//value es el valor que nos va a devolver
followThisUsers(req.user.sub,userId).then((value)=>{
	user.password=undefined;
return res.status(200).send({
	user,
	following: value.following,
	followed: value.followed });
});

	



	});
}





//funcion asincrona lo que puedo ejecutarla en cualquier parte
//lo que va adnetro cualquier tipo de consulta pero sincrona
//cuando se ejecute algo se espere el resultado y despues pase lo siguiente


/*
async function followThisUser(identity_user_id,user_id){
//si el usuario me sigue ami
//await se usa para convertirloen una llamada sincrona
var following= await Follow.findOne({'user':identity_user_id,'followed':user_id}).exec((err,follow)=>{
	
if(err) return handleError(err);
	return follow
});
//si ese usuario nos sigue a nosotros
var followed= await Follow.findOne({'user':user_id,'followed':identity_user_id}).exec((err,follow)=>{
	
if(err) return handleError(err);
	return follow;
});

return{
	following:following,
	followed:followed
}

}


*/
//arreglado
async function followThisUsers(identity_user_id, user_id) {
    var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });
 
    var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec().then((follow) => {
        console.log(follow);
        return follow;
    }).catch((err) => {
        return handleError(err);
    });
 
 
    return {
        following: following,
        followed: followed
    }
}

async function followUsersIds(user_id) {
    var following = await Follow.find({ "user": user_id }).select({'_id':0,'__v':0,'user':0})
    .exec((err,follows) => {
    	var follows_clean=[];
    	follows.forEach((follow)=>{
    		follows_clean.push(follow.followed);
    	});
       return follows_clean;
    });

    var followed = await Follow.find({ "followed": user_id }).select({'_id':0,'__v':0,'followed':0})
    .exec((err,follows) => {
    	var follows_clean=[];
    	follows.forEach((follow)=>{
    		follows_clean.push(follow.user);
    	});
       return follows_clean;
    });
 

  return {
        following: following,
        followed: followed
    }
}
///////////SACADO DE INTERNET



function getUsers(req,res){
    var user_id = req.user.sub;
     
    var page = 1;
    if(req.params.page){
    page = req.params.page;
    }
    var itemsPerPage = 5;
     
    User.find().sort('_id').paginate(page,itemsPerPage,(err,users,total)=>{
    if(err) return res.status(500).send({message:"Error en la peticion",err});
    if(!users) return res.status(404).send({message:"No hay Usuarios"});
     
    followUserIds(user_id).then((response)=>{
    return res.status(200).send({message:"Resultados",
    	users,
    	users_following: response.following,
    	users_followed: response.followed,
    	total,
    	pages: Math.ceil(total/itemsPerPage)});
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




////
/*
async function followUsersIds2(user_id) {
    var following = await Follow.find({ "user": user_id }).select({'_id':0,'__v':0,'user':0}).exec()
    .then((follows) => {
        
		var follows_clean=[];
    	follows.forEach((follow)=>{
    	follows_clean.push(follow.followed);
    	return follows_clean;

    }).catch((err) => {
        return handleError(err);
    });
 
    var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec().then((follow) => {
        console.log(follow);
        return follow;
    }).catch((err) => {
        return handleError(err);
    });
 
 
    return {
        following: following,
        followed: followed
    }
}

*/



/*


//devolver un listado de usuarios paginados
function getUsers(req,res){
//recoger el id del usuario que esta logueado en este momento
//obejto completo dlel usuario en middleware ,
//,que que se decoficado del token 
	var identity_user_id=req.user.sub;
	//pagina que estamos recogiendo
	var page=1;
	//si nos llega este parametro
	if(req.params.page){
page=req.params.page;
	}
	//la cantidad de elementos que se mostraran por pagina
	//cantidad de usuarios por pagina
	//a partir de 5 se crearan nueva pagina
	var itemsPerPag=5;
	//listar todos los usuarios de la base datos 
	//y los ordenamos por id (sort)
	//paginate para paginar esos resultado y el # pagina que estamos actualmente
	//total contar la cantidad de registros si hay 100.000 usuarios
	User.find().sort('_id').paginate(page,itemsPerPag,(err,users,total)=>{
		if(err) return res.status(500).send({message:'Error en la peticion'});
		if(!users) return res.status(404).send({message:'no hay usuarios disponibles'});

		followUsersIds(identity_user_id).then((value)=>{

			//todo salga bien . devolviendo todos los usuarios
		return res.status(200).send({
			//toos los datos de los usuarios
			users,
			users_following:value.following,
			users_follow_me:value.followed,
			//la cantidad total de los usuarios
			total,
			//numero de paginas totales que hay
			//10/5=2
			page:Math.ceil(total/itemsPerPag)
		});


});
			});

}


*/



//ediccion de datos de usuario ACTUALIZAR
function updateUser(req,res){
	var userId=req.params.id;
	var update=req.body;
	//borra la propiedad password
	delete update.password;
	//si user id es ! usuaio identificado no tiene prmiso para actualizar
if(userId != req.user.sub){
	return res.status(500).send({message:'no tienes permiso para actualizar los datos del usuario'});

}

User.find({ $or: [
	{email:update.email.toLowerCase()},
	{nick:update.nick.toLowerCase()}
	]}).exec((err,users)=>{
		console.log(users)
		var user_isset=false;
		users.forEach((user)=>{
if(user && user._id!=userId) user_isset=true;
		});
		if(user_isset)return res.status(404).send({message:'Los datos ya estan en uso'});
	//busco un documento por su userid y le paso por 2 parametro los datos a actualizar
//3 parametro es para el objeto actualizado
//4 parametro el callback
User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{
if(err) return res.status(500).send({message:'Error en la peticion'});
if(!userUpdated) return res.status(500).send({message:'No se ha podido actualizar el usuario'});
return res.status(200).send({user:userUpdated});
	});

});

}


//subir imagen AVATAR DE USUARIO

function uploadImage(req,res){
var userId=req.params.id;

//cuando abrimo la req hay una propiedad file
//si eexiste file o estamos enviando algiun fichero
if(req.files){
	//es todo el archivo que hemos subido
var file_path=req.files.image.path;
console.log(file_path);
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
//el mismo usuario es el que debe cambiar la imagen
if(userId != req.user.sub){
	return removeFileOfUpload(res,file_path,'no tienes permiso para actualizar los datos del usuario');
	

	}


		if(file_ext=='png'||file_ext=='jpg'||file_ext=='jpeg'||file_ext=='gif'||file_ext=='mp4'){
			//Actualizar documento usuario logueado
//pasar el user id , un objeto json image y el valor,devuelva el objeto renovado y el callback
			User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err,userUpdated)=>{
				if(err) return res.status(500).send({message:'Error en la peticion'});
if(!userUpdated) return res.status(500).send({message:'No se ha podido actualizar el usuario'});
return res.status(200).send({user:userUpdated});
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

function removeFileOfUpload(res,file_path,message){
	fs.unlink(file_path,(err)=>{
	return res.status(200).send({message:message});

});
}

function getImage(req,res){
	//recoger por la url
	//el nombre de fichero que le vamos a pasar por la url
	//va recibir el metodo y va sacar esa imagen del sistemas de fichero
	var image_file=req.params.imageFile;
	//va tener el path de las imagenes de usuario
	var path_file='./uploads/users/'+image_file;
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
//contador de cuantos nos sigue y cuantos segui9mos
function getCounters(req,res){

  let userId = req.user.sub;

    if(req.params.id){
        userId = req.params.id;      
    }
    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    })


}



async function getCountFollow(user_id) {
    var following = await Follow.countDocuments({ user: user_id })
        .exec()
        .then((count) => {
            console.log(count);
            return count;
        })
        .catch((err) => { return handleError(err); });
 
    var followed = await Follow.countDocuments({ followed: user_id })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => { return handleError(err); });

         var publications = await Publication.countDocuments({ user: user_id })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => { return handleError(err); });
 
    return { following: following, followed: followed, publications:publications }
}



module.exports={
	home,pruebas,saveUser,loginUser,getUser,getUsers,updateUser,uploadImage,getImage,getCounters
}






