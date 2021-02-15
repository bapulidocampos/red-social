//maneja las rutas controlador usuario
'use strict'
var express=require('express');
var UserController=require('../controllers/user');
var api=express.Router();


var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/users'});

//cargamos los middleware 
var md_auth=require('../middlewares/authenticated');
api.get('/home',UserController.home);
api.get('/pruebas',md_auth.ensureAuth,UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
//metodo de autentificacion , para comprar si esta logueado correctamente
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser);
 api.get('/users/:page?',md_auth.ensureAuth,UserController.getUsers);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.get('/counters/:id?',md_auth.ensureAuth,UserController.getCounters);
//como vamos a tener varios middlewares tenemos que usar un array
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);
api.get('/get-image-user/:imageFile',UserController.getImage);

module.exports=api;