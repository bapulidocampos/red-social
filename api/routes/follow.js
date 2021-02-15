'use strict'
var express=require('express');
//carga el controlador de follow
var FollowController=require('../controllers/follow');
//cargar el router de express
var api=express.Router();
//middleware autentificacion y subida de archivo
var md_auth=require('../middlewares/authenticated');
 api.post('/follow',md_auth.ensureAuth, FollowController.saveFollow);
 api.delete('/follow/:id',md_auth.ensureAuth,FollowController.deleteFollow);
  api.get('/following/:id?/:page?',md_auth.ensureAuth,FollowController.getFollowUsers);
   api.get('/followed/:id?/:page?',md_auth.ensureAuth,FollowController.getFollowedUsers);
   
   api.get('/get-my-follows/:followed?',md_auth.ensureAuth,FollowController.getMyFollow);
 module.exports=api;