import express, { urlencoded } from "express"
import { engine } from "express-handlebars"
import __dirname from "./utils.js"
import * as path from "path"
import multer from "multer"
import router from "./routes/vistas.js";
import {Server} from "socket.io"
import { createServer } from "http"

const app = express()
const PORT= 4000

//Configuracion express
app.use(express.json());
app.use(urlencoded({extended:true}));

//static permite que no haga falta traer el css por propiedad de archivos estaticos
app.use("/", express.static(__dirname + "/public"))

app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname) + "/views")


const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors:{
        origin: '*',
    }
})

var now= new Date();

io.on('connection', (socket)=>{
    socket.emit('Bienvenido!');
    console.log("Nueva conexion a las:" + now);

    // socket.on("insertar", (usuario)=>{
    //     console.log("se ejecuto a las: " + now);
    //     socket.broadcast.emit('insert', usuario)
    // })

    // socket.on("eliminar", (id)=>{
    //     console.log("se ejecuto a las: " + now);
    //     console.log(id)
    //     socket.broadcast.emit('delete', id)
    // })

    // socket.on('disconnect', ()=>{
    //     console.log("Se desconecto a las: ", + now)
    // })
})


//ROUTER
app.use('/vistas', router)

//SERVIDOR CON WEBSOCKET
httpServer.listen(PORT, ()=>console.log("El socket fue iniciado en el puerto "+ PORT))

// //LISTEN
// app.listen(PORT, () =>{
//     console.log(`Servidor por puerto ${PORT}`)
// })