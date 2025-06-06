import * as path from "path";
import express from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";
import __dirname from "../utils.js"
import { obtenerArchivosDeUploads } from "../utils.js";
import upload from '../middlewares/multer.js';
import { socketMiddleware } from '../middlewares/socketMiddleware.js';
import { 
    uploadFile, 
    getFiles, 
    deleteFile,
    readFile 
} from '../controllers/uploadController.js';


const router = express.Router();
const productManager= new ProductManager();
const cartManager= new CartManager(productManager);

const filePath =path.join(__dirname, "../../products.json")

router.use(socketMiddleware);

//ruta que recibe archivos:
router.post('/upload', upload.single('archivo'), uploadFile);
//ruta para traer los archivos:
router.get('/files', getFiles);
//ruta para leer archivo
router.get('/api/files/:filename', readFile);
//ruta para borrar un archivo segun su nombre
router.delete('/files/:filename', deleteFile);




router.get('/home', async (req, res)=>{
    try{
        const ultimoCarrito = await cartManager.getCart();

        const productos= ultimoCarrito.products;
        const carritoId = ultimoCarrito.id

        const productosAgrupados= productos.reduce((acc, producto)=>{
            const productoExistente = acc.find(p => p.id === producto.id);
            if(productoExistente){
                productoExistente.quantity += 1;
            }else{
                acc.push({...producto, quantity: 1});
            }

            return acc
        }, []);

        res.render("home", {products: productosAgrupados, carritoId})
    }catch(error){
        console.error("Error al obtener el ultimo carrito creado:", error)
        res.status(500).send("Error al cargar los productos del carrito.")
    }
});

router.get("/realTimeProducts", async (req, res)=>{
    try{

        const ultimoCarrito = await cartManager.getCart();
        const productosDeCarrito= ultimoCarrito.products;
        const carritoId = ultimoCarrito.id

        const productos = await productManager.getProducts();


        res.render("partials/realTimeProducts", {productos, carritoId})
    }catch(error){
        console.error("Error al cargar la lista de productos disponibles", error);
        res.status(500).send("Error al cargar los productos disponibles")
    }
})

router.get('/multer', async (req, res) => {
    const archivos= await obtenerArchivosDeUploads();
    res.render('partials/multer', {archivos});
});

router.post('/aplicar-productos', async (req, res) => {
    try {
        const { archivo } = req.body;
        
        console.log('Archivo recibido:', archivo);
        
        if (!archivo) {
            return res.json({ success: false, error: 'No se especificó archivo' });
        }

        const fs = await import('fs/promises');
        
        // Usar rutas absolutas basadas en process.cwd()
        const sourcePath = path.join(process.cwd(), 'uploads', archivo);
        const destPath = path.join(process.cwd(), 'src/products.json');
        
        console.log('Source path:', sourcePath);
        console.log('Dest path:', destPath);
        
        // Verificar que el archivo existe
        await fs.access(sourcePath);
        
        // Copiar el archivo
        await fs.copyFile(sourcePath, destPath);
        
        console.log('Archivo copiado exitosamente');
        
        res.json({ 
            success: true, 
            mensaje: `Archivo ${archivo} aplicado como products.json exitosamente` 
        });
        
    } catch (error) {
        console.error('Error al aplicar archivo:', error);
        res.json({ 
            success: false, 
            error: `Error al aplicar el archivo: ${error.message}` 
        });
    }
});

export {router, cartManager, productManager};