'use strict'
var express=require('express');
//carga el controlador de follow
var ComentaryController=require('../controllers/comentary');
//cargar el router de express
var api=express.Router();
//middleware autentificacion y subida de archivo
var md_auth=require('../middlewares/authenticated');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/comentary'});

 api.get('/probando-com',md_auth.ensureAuth,ComentaryController.probando);
 api.post('/comentary',md_auth.ensureAuth,ComentaryController.savePublication);
 api.get('/publications/:page?',md_auth.ensureAuth,ComentaryController.getPublications);
  api.get('/publications/:page?',md_auth.ensureAuth,ComentaryController.getPublicationss);
 api.get('/publications-user/:user/:page?',md_auth.ensureAuth,ComentaryController.getPublicationss);
 //api.get('/publications-user/:user/:page?',md_auth.ensureAuth,PublicationController.getPublicationsUser);
 api.get('/publication/:id?',md_auth.ensureAuth,ComentaryController.getPublication);
 api.delete('/publication/:id',md_auth.ensureAuth,ComentaryController.deletePublication);
api.post('/upload-image-pub/:id',[md_auth.ensureAuth,md_upload],ComentaryController.uploadImage);
api.get('/get-image-pub/:imageFile',ComentaryController.getImageFile);
 module.exports=api;
