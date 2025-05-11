import fs from 'node:fs'
import * as path from "path"
import __dirname from "./src/utils.js"
const pathCarritos= path.join(__dirname, 'carts.json'); //Ruta absoluta

//CREAR CLASE CARTMANAGER E INTEGRARLE TODOS LOS METODOS(FUNCIONES):

class CartManager{
    constructor(productManager){
        if (!fs.existsSync(pathCarritos)){

            fs.promises.writeFile(pathCarritos, JSON.stringify([]));
        }
        //Guardar la instancia de ProductManager para usar el metodo de getProductById()
        this.productManager = productManager;
    }

    async getCarts(){
        //La funcion retorna un listado de carritos
        const carritos = await fs.promises.readFile(pathCarritos, 'utf-8');
        return JSON.parse(carritos);
    }

    async getCartById(cid){
        //La funcion retorna el carrito en la lista cuyo id sea igual al argumento
        const carritos = await this.getCarts();
        return carritos.find(carrito => carrito.id ===cid)||null;
    }

    async getCart(){
        //La funcion retorna la ultima instancia del carrito creado.
        const carritos = await this.getCarts();
        return carritos.length > 0 ? carritos[carritos.length - 1] : null;


    }

    async createCart(){
        //La funcion crea un nuevo carrito y lo agrega al final de la lista
    
        const carritos = await this.getCarts();

        const newId = carritos.length > 0 ? Number(carritos[carritos.length -1].id)+1:1;

        const newCart = {id:newId, products:[]};

        carritos.push(newCart);

        await fs.promises.writeFile(pathCarritos, JSON.stringify(carritos, null, 2));

        console.log(`Carrito creado con ID: ${newId}`);
        return newCart;
    }
    
    async addProductToCart(cid, pid){
        //La funcion agrega producto con id *pid* al final de la lista del carrito con id *cid*
        
        const listaCarritos= await this.getCarts();
        const carrito= await this.getCartById(cid);
        const producto= await this.productManager.getProductById(pid);

        if(!carrito){
            console.error(`carrito con id ${cid} no encontrado.`)
            return;
        }
        
        if(!producto){
            console.error(`Producto con id ${pid} no encontrado.`)
            return;
        }


        carrito.products.push(producto);

        const carritoIndex = listaCarritos.findIndex(c=> c.id ===cid)
        listaCarritos[carritoIndex] = carrito;
    
        await fs.promises.writeFile(pathCarritos, JSON.stringify(listaCarritos, null, 2));

        console.log(`Producto con ID ${pid} agregado al carrito con ID ${cid}.`);
    }

    async removeProductFromCart(cid, pid) {
    // Obtener la lista de carritos
    const listaCarritos = await this.getCarts();
    const carrito = await this.getCartById(cid);

    // Validar si el carrito existe
    if (!carrito) {
        console.error(`Carrito con id ${cid} no encontrado.`);
        return;
    }

    // Buscar el índice del producto en el carrito
    const productIndex = carrito.products.findIndex(producto => producto.id === pid);

    // Validar si el producto existe en el carrito
    if (productIndex === -1) {
        console.error(`Producto con id ${pid} no encontrado en el carrito con id ${cid}.`);
        return;
    }

    // Eliminar el producto del carrito
    carrito.products.splice(productIndex, 1);

    // Actualizar el carrito en la lista general
    const carritoIndex = listaCarritos.findIndex(c => c.id === cid);
    listaCarritos[carritoIndex] = carrito;

    // Guardar los cambios en el archivo
    await fs.promises.writeFile(pathCarritos, JSON.stringify(listaCarritos, null, 2));

    console.log(`Producto con ID ${pid} eliminado del carrito con ID ${cid}.`);
}



}

export default CartManager