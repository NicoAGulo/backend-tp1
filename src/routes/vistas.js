import * as path from "path";
import express from "express";
import CartManager from "../../CartManager.js";
import ProductManager from "../../ProductManager.js";
import __dirname from "../utils.js"

const router = express.Router();
const productManager= new ProductManager();
const cartManager= new CartManager(productManager);

const filePath =path.join(__dirname, "../../products.json")

router.get('/home', async (req, res)=>{
    try{
        const ultimoCarrito = await cartManager.getCart();
        const products= ultimoCarrito.products;
        const carritoId = ultimoCarrito.id

        res.render("home", {products, carritoId})
    }catch(error){
        console.error("Error al obtener el ultimo carrito creado:", error)
        res.status(500).send("Error al cargar los productos del carrito.")
    }
});

router.post("cart/:cid/add_product/:pid", async (req, res)=>{
    const {cid, pid} = req.params;

    try{
        await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
        res.redirect("/home");
    }catch (error){
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).send("Error al agregar el producto al carrito");
    }
});

router.delete("cart/:cid/delete_product/:pid", async (req, res)=>{
    const {cid, pid} =req.params;

    try{
        await cartManager.removeProductFromCart(parseInt(cid), parseInt(pid));
        res.status(200).send(`producto con ID ${pid} eliminado del carrito con ID ${cid}.`)
    } catch (error){
        console.error("Error al eliminar el producto del carrito: ", error);
        res.status(500).send("Error al eliminar el producto del carrito.")
    }
})

router.get("/realTimeProducts", async (req, res)=>{
    try{
        const productos= await productManager.getProducts();
        res.render("partials/realTimeProducts", {productos})
    }catch(error){
        console.error("Error al cargar la lista de productos disponibles", error);
        res.status(500).send("Error al cargar los productos disponibles")
    }

})

export default router;