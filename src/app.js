import express, { urlencoded } from "express"
import { engine } from "express-handlebars"
import __dirname from "./utils.js"
import * as path from "path"
import { promises as fs } from "fs"
import {Server} from "socket.io"
import { createServer } from "http"
import {router} from './routes/vistas.js'
import { socketHandlers } from "./socketHandler.js"
import { socketMiddleware } from "./middlewares/socketMiddleware.js"

const app = express()
const PORT= 4000

//Configuracion express
app.use(express.json());
app.use(urlencoded({extended:true}));

//static permite que no haga falta traer el css por propiedad de archivos estaticos
app.use("/", express.static(path.join(__dirname, "/public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname) + "/views")

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE"]
    }
});

app.set('io', io);
app.use(socketMiddleware);

//ROUTER
app.use('/vistas', router);

socketHandlers(io);

async function iniciarServidor() {
    try {
        // Crear carpeta uploads si no existe
        await fs.access('./uploads').catch(() => 
            fs.mkdir('./uploads', { recursive: true })
        );
        
        // Crear carpeta public si no existe (para archivos estáticos)
        await fs.access('./public').catch(() => 
            fs.mkdir('./public', { recursive: true })
        );
        
        const PORT = process.env.PORT || 3000;
        
        httpServer.listen(PORT, () => {
            console.log(`Servidor con WebSockets iniciado en puerto ${PORT}`);
            console.log(`Carpeta de uploads: ${path.resolve('./uploads')}`);
        });
        
    } catch (error) {
        console.error('Error iniciando servidor:', error);
        process.exit(1);
    }
}

iniciarServidor();



// //SERVIDOR CON WEBSOCKET
// httpServer.listen(PORT, ()=>console.log("El socket fue iniciado en el puerto "+ PORT))


// //LISTEN
// app.listen(PORT, () =>{
//     console.log(`Servidor por puerto ${PORT}`)
// })