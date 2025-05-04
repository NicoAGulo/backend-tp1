const fs = require('fs'); //Para permitir el CRUD mediante sistema de archivos.
const path = require ('path'); //Para trabajar con rutas de forma segura.
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
        //La funcion agrega al final de la lista del carrito cuyo id sea igual al 1er argumento el producto cuyo id sea igual al 2do argumento
        
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

}

module.exports= CartManager;
