'use strict'
var express=require('express');
//carga el controlador de follow
var PublicationController=require('../controllers/publication');
//cargar el router de express
var api=express.Router();
//middleware autentificacion y subida de archivo
var md_auth=require('../middlewares/authenticated');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/publications'});

 api.get('/probando-pub',md_auth.ensureAuth,PublicationController.probando);
 api.post('/publication',md_auth.ensureAuth,PublicationController.savePublication);
 api.get('/publications/:page?',md_auth.ensureAuth,PublicationController.getPublications);
 //aqui
  api.get('/publicationse/:page?',md_auth.ensureAuth,PublicationController.getPublicatione);
  //aqui
    api.get('/publicationsex/:page?',md_auth.ensureAuth,PublicationController.getPublicationex);
 api.get('/publicationsexx/:page?',md_auth.ensureAuth,PublicationController.getPublicationexx);
  api.get('/publicationsexxs/:page?',md_auth.ensureAuth,PublicationController.getPublicationexxs);
   


 api.get('/publications/:page?',md_auth.ensureAuth,PublicationController.getPublicationss);
 api.get('/publications-user/:user/:page?',md_auth.ensureAuth,PublicationController.getPublicationss);


 //api.get('/publications-user/:user/:page?',md_auth.ensureAuth,PublicationController.getPublicationsUser);
 api.get('/publication/:id?',md_auth.ensureAuth,PublicationController.getPublication);
 api.delete('/publication/:id',md_auth.ensureAuth,PublicationController.deletePublication);
api.post('/upload-image-pub/:id',[md_auth.ensureAuth,md_upload],PublicationController.uploadImage);
api.post('/upload-com-pub',[md_auth.ensureAuth,md_upload],PublicationController.uploadcomentario);

api.get('/get-image-pub/:imageFile',PublicationController.getImageFile);
 module.exports=api;
