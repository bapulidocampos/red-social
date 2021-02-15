'use strict'
var express=require('express');
//carga el controlador de follow
var ImcController=require('../controllers/imc');
//cargar el router de express
var api=express.Router();
//middleware autentificacion y subida de archivo
var md_auth=require('../middlewares/authenticated');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/imc'});

 api.get('/imc',md_auth.ensureAuth,ImcController.probando);
 api.post('/imc',md_auth.ensureAuth,ImcController.savePublication);
 api.get('/imc-get/:page?',md_auth.ensureAuth,ImcController.getPublications);
 api.get('/imc-get/:page?',md_auth.ensureAuth,ImcController.getPublicationss);
 // api.get('/exercises-gett/:page?',md_auth.ensureAuth,ImcController.getPublicationsss);
 api.get('/imc-user/:user/:page?',md_auth.ensureAuth,ImcController.getPublicationss);
 //api.get('/publications-user/:user/:page?',md_auth.ensureAuth,PublicationController.getPublicationsUser);
 api.get('/publication/:id?',md_auth.ensureAuth,ImcController.getPublication);
 api.delete('/imc/:id',md_auth.ensureAuth,ImcController.deletePublication);
api.post('/upload-image-exe/:id',[md_auth.ensureAuth,md_upload],ImcController.uploadImage);
api.get('/get-image-exe/:imageFile',ImcController.getImageFile);
 module.exports=api;
 