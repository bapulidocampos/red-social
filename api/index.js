//nuevas caracterisitcas de java script funciones de flecha etc..
'use strict'
var mongoose=require("mongoose");
//cargamos app ya que hay esta express
var app=require('./app');
var port=3800;
//conexion mediante las promesas
mongoose.Promise=global.Promise;
//hacemos la conexion y le indicamos la url de mongodb
//mongoose.connect('mongodb://localhost:27017/curso_mean_social',{useNewUrlParser: true })
//USE .. se va a cponectar como cliente mongodb
mongoose.connect('mongodb://localhost:27017/curso_mean_social',{useUnifiedTopology: true })
//mongoose.connect('mongodb://localhost:27017/curso_mean_social',{useMongoClient:true})
//SI SE REALIZA LA CONEXION SE VA A LANZAR
.then(()=>{
	console.log("-- la conexion de la base de datos curso_mean_social se ha realizado con exito")
//crear servidor
app.listen(port,()=>{
	console.log("servidor corriendo localhost:3800");
});


}).catch(err =>console.log(err));
//si no se puede , para eso estar el catch, que captura los errores
