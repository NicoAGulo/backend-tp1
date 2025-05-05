const express =require('express');
const app= express();
const PORT = 3000;

// const fs = require('fs');
// const path = require ('path');
// const pathProductos= path.join(__dirname, 'products.json')


const ProductManager = require('./ProductManager.js')
const productManager = new ProductManager();

app.get("/products", async (req, res)=>{
    try {
        const products = await productManager.getProducts();
        res.json(products);
    }catch(error){
        console.error("Error al obtener los productos:", error);
        res.status(500).json({error:'Error al obtener los productos'});
    }
});

app.get("/products/:id", async (req, res)=>{
    const {id} = req.params
    const products = await productManager.getProducts();
    producto = products.find(p => p.id === parseInt(id))
    if(!producto) return res.status(404).json({mensaje: "Producto no encontrado"})
    res.json(producto)
});





app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})