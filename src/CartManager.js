import fs from 'node:fs'
import * as path from "path"
import __dirname from "./utils.js"
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
        try{
            const listaCarritos= await this.getCarts();
            const carrito= await this.getCartById(cid);
            const producto= await this.productManager.getProductById(pid);
            
            if(!carrito){
                // console.error(`carrito con id ${cid} no encontrado.`)
                return {success: false, message: "Carrito no encontrado"};
            }
            
            if(!producto){
                // console.error(`Producto con id ${pid} no encontrado.`)
                return{success: false, message:"Producto no encontrado"};
            }
            
            
            carrito.products.push(producto);

            const index = listaCarritos.findIndex(c => c.id === cid);
            if (index !== -1) {
              listaCarritos[index] = carrito;
            }            
            await fs.promises.writeFile(pathCarritos, JSON.stringify(listaCarritos, null, 2));

            return {success: true};
        }catch(error){
            console.error('Error real al agregar producto:', error)
            return{success: false, message:"Error interno"}
        }
    }

    async removeProductFromCart(cid, pid) {
    // Obtener la lista de carritos
    const listaCarritos = await this.getCarts();
    const carritoIndex = listaCarritos.findIndex(c => c.id ===cid);

    // Validar si el carrito existe
    if (carritoIndex === -1) {
        console.error(`Carrito con id ${cid} no encontrado.`);
        return{success: false, message: "Carrito no encontrado"};
    }
    
    // Actualizar el carrito en la lista general
    const carrito = listaCarritos[carritoIndex]

    // Buscar el índice del producto en el carrito
    const productIndex = carrito.products.findIndex(producto => producto.id === pid);
    // Validar si el producto existe en el carrito
    if (productIndex === -1) {
        console.error(`Producto con id ${pid} no encontrado en el carrito con id ${cid}.`);
        return{ success: false, message:"Producto no encontrado en el carrito"};
    }

    // Eliminar el producto del carrito
    carrito.products.splice(productIndex, 1);

    // Guardar los cambios en el archivo
    await fs.promises.writeFile(pathCarritos, JSON.stringify(listaCarritos, null, 2));

    console.log(`Producto con ID ${pid} eliminado del carrito con ID ${cid}.`);
    return{success: true};
}



}

export default CartManager