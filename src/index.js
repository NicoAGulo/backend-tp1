import fs from 'node:fs'
import express, { urlencoded } from "express"
import { engine } from "express-handlebars"
import __dirname from "./utils.js"
import * as path from "path"
import multer from "multer"
import router from "./routes/vistas.js";

const app = express()
const PORT= 4000

//Configuracion express
app.use(express.json());
app.use(urlencoded({extended:true}));

//ESTRUCTURA MULTER:

//Se define ruta uploads en multer para destinos
const products= multer({dest: 'products/'});

//POST PARA AGREGAR PRODUCTO AL ARRAY DE PRODUCTOS DESDE CLIENTE
//Estructura POST de un solo archivo llamado imagenPerfil que llama a funcion saveImage para editar el nombre del archivo al guardarse.
app.post('/images/single', upload.single('imagenPerfil'), (req, res)=>{
    console.log(req.file);
    saveImage(req.file);
    res.send('Termina')
})

//SOSTENIBLE POR FS Y LOCALSTORAGE
function saveImage(file){
    const newPath =`./uploads/${file.originalname}`
    fs.renameSync(file.path, newPath);
    return newPath
}

app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname) + "/views")


// //Version de prueba para ver que funcione express correctamente
// app.get("/", (req, res)=>{
//     res.send("Hola soy un servidor por Express")
// })

//static permite que no haga falta traer el css por propiedad de archivos estaticos
app.use("/", express.static(__dirname + "/public"))


//ROUTER
app.use('/vistas', router)

// app.post('upload', upload.single('file'), (req, res)=>{
//     res.send('Archivo se ha subido correctamente')
// })

// //Se puede llamar a arrays para invocarlos en home segun logica
// const products = [
//     {
//         nombre: "Pablo",
//         apellido: "Gonzalez"
//     },{
//         nombre: "Rodolfo",
//         apellido: "Panini"
//     },{
//         nombre: "Gabriel",
//         apellido: "Ramales"
//     }
// ]




// //Renderizar la pag principal home.handlebars
// app.get("/", (req, res)=>{
//     res.render("home",{
//         title: "Backend | Handlebars",
//         admin:false,
//         puerto: PORT===4000,
//         products: products
//     })
// });


app.listen(PORT, () =>{
    console.log(`Servidor por puerto ${PORT}`)
})