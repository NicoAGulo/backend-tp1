const fs = require('fs'); //Para permitir el CRUD mediante sistema de archivos.
const path = require ('path'); //Para trabajar con rutas de forma segura.
const { getProductById } = require('./ProductManager');
const pathCarritos= path.join(__dirname, 'carts.json'); //Ruta absoluta

//CREAR CLASE CARTMANAGER E INTEGRARLE TODOS LOS METODOS(FUNCIONES):

class CartManager{
    constructor(){
        if (!fs.existsSync(pathCarritos)){
            fs.writeFileSync(pathCarritos, JSON.stringify([]));
        }
    }

    async getCarts(){
        //La funcion retorna un listado de carritos
        const carritos = await fs.promises.readFileSync(pathCarritos, 'utf-8');
        return JSON.parse(carritos);
    }

    async getCartById(cid){
        //La funcion retorna el carrito en la lista cuyo id sea igual al argumento
        const carritos = await this.getCarts();
        return carritos.find(carrito => carrito.id ===cid);
    }
    
    async createCart(cart){
        //La funcion crea un nuevo carrito y lo agrega al final de la lista
    
        const carritos = await this.getCarts();
        carritos.push(cart);
        await fs.promises.writeFile(pathCarritos, JSON.stringify(carritos, null, 2));
    }
    
    async addProductToCart(cid, pid){
        //La funcion agrega al final de la lista del carrito cuyo id sea igual al 1er argumento el producto cuyo id sea igual al 2do argumento
        
        const listaCarritos= await this.getCarts();
        const carrito= await this.getCartById(cid);
        const producto= await getProductById(pid);

        if(!carrito){
            console.error(`carrito ccon id ${cid} no encontrado.`)
            return;
        }
        
        if(!producto){
            console.error(`Producto ccon id ${pid} no encontrado.`)
            return;
        }


        carrito.products = carrito.products || [];
        carrito.products.push(producto);
    
        await fs.promises.writeFile(pathCarritos, JSON.stringify(listaCarritos, null, 2));
    }

}
