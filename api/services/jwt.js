'use strict'
var jwt=require('jwt-simple');
var moment=require('moment');
var secret='clave_secreta_curso_desarrollar_red_social_angular';

exports.createToken=function(user){
//payload va contener los datos del usurio que voy a codificar
var payload={
//sub identificador de documento (id)
sub:user._id,
name:user.name,
nick:user.nick,
surname:user.surname,
email:user.email,
role:user.role,
image:user.image,
//fecha de creacion del token  (moment la fecha timestand unix)
iat:moment().unix(),
//fecha de expiracion
exp:moment().add(30,'days').unix
};

return jwt.encode(payload,secret);

};