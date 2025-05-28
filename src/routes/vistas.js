import * as path from "path";
import express from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";
import __dirname from "../utils.js"

const router = express.Router();
const productManager= new ProductManager();
const cartManager= new CartManager(productManager);

const filePath =path.join(__dirname, "../../products.json")

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

export {router, cartManager, productManager};