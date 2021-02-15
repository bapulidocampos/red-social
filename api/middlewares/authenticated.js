'use strict'
var jwt=require('jwt-simple');
var moment=require('moment');
var secret='clave_secreta_curso_desarrollar_red_social_angular';
//next para podernos salir del middleware
//ensureAuth metodo del middleware
//next funcionalidad que nos permite saltar a otra cosa
exports.ensureAuth=function(req,res,next){
if(!req.headers.authorization){
	return res.status(403).send({message:'la peticion no tien la cabecera de autentificacion'
});

}
//si mellegara y le quitamos las comillas dobles o simple que tuvieran
var token=req.headers.authorization.replace(/['"]+/g, '');

try{
//decodificamos el payload id name email
var payload=jwt.decode(token,secret);
//payload exp(expiracion si es menor a la fecha actual)
	if(payload.exp<=moment().unix()){
return res.status(401).send({message:'el token ha expirado'});
	}
}
catch(ex){
	return res.status(404).send({message:'el token no es valido'});
}

req.user=payload;
next();
}


