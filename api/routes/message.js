'use strict'
var express=require('express');
//carga el controlador de follow
var MessageController=require('../controllers/message');
//cargar el router de express
var api=express.Router();
//middleware autentificacion y subida de archivo
var md_auth=require('../middlewares/authenticated');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/publications'});

 api.get('/probando-mes',md_auth.ensureAuth,MessageController.probando);
 api.post('/message',md_auth.ensureAuth,MessageController.saveMessage);
 api.get('/my-messages/:page?',md_auth.ensureAuth,MessageController.getReceivedMessage);
  api.get('/messages/:page?',md_auth.ensureAuth,MessageController.getEmmitMessage);
    api.get('/unviewed-messages',md_auth.ensureAuth,MessageController.getUnviewedMessage);
    api.get('/set-viewed-messages',md_auth.ensureAuth,MessageController.setViewedMessage);
    
 



  module.exports=api;