//INDEX.JS CONEXIONES Y LA CREACION DEL SERVIDOR
//APP.JS LLEVAR CARGAS DE FICHEROS , CONFIGURACIONES

'use strict'
//traemos a express y bodyparse
var express=require('express');
var bodyParser=require('body-parser');
var app=express();

//cargar rutas

var user_routes=require('./routes/user');
var follow_routes=require('./routes/follow');
var publication_routes=require('./routes/publication');
var exercise_routes=require('./routes/exercise');
var message_routes=require('./routes/message');
var imc_routes=require('./routes/imc');
var comentary_routes=require('./routes/comentary');
//---midleware: es un metodo que se ejecuta antes de llegar a un controlador
//permite crear un midleware, en cada peticion se ejecuta ese midleware
app.use(bodyParser.urlencoded({extended:false}));
//convierta lo que nos llega de body en json(convertir en un objeto json)
app.use(bodyParser.json());
//cors PARA ESCRIBIR TODAS LAS CABECERAS Y PERMITIR QUE LAS PETICIONES AJAX SE HAGAN CORRECTAS ENTRE ANGULAR Y BACKEND
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


//rutas
app.use('/api',user_routes);
app.use('/api',follow_routes);
app.use('/api',publication_routes);
app.use('/api',exercise_routes);
app.use('/api',message_routes);
app.use('/api',imc_routes);
app.use('/api',comentary_routes);

/*
app.get("/pruebas",(req,res)=>{
	res.status(200).send({
		message:'accion de pruebas del servidor'
	});
});

app.post("/",(req,res)=>{
	console.log(req.body);
	res.status(200).send({
		message:'Hola mundo'
	});
});
*/
//---exportar la configuracion -. exportar lo que app tenga
module.exports=app;
