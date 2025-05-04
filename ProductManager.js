const fs = require('fs'); //Para permitir el CRUD mediante sistema de archivos.
const path = require ('path'); //Para trabajar con rutas de forma segura.
const pathProductos= path.join(__dirname, 'products.json'); //Ruta absoluta


//CREAR CLASE PRODUCTMANAGER E INTEGRARLE TODOS LOS METODOS (CRUD)

class ProductManager{
    constructor(){

        
        if (!fs.existsSync(pathProductos)){
            fs.promises.writeFile(pathProductos, JSON.stringify([]));
        }
    }

    async getProducts() {
        //La funcion retorna un listado de productos 
        const productos = await fs.promises.readFile(pathProductos, 'utf-8');
        return JSON.parse(productos);
    }
    
    async getProductById(pid) {
        //La funcion retorna el producto en la lista cuyo id sea igual al argumento
        const productos = await this.getProducts();
        return productos.find(producto => producto.id === pid)
    }
    
    async addProduct(product) {
        //La funcion crea un nuevo producto y lo agrega al final de la lista de productos
        const productos = await this.getProducts();
        productos.push(product);
        fs.promises.writeFile(pathProductos, JSON.stringify(productos));
    }
    
    async updateProduct(pid, updated) {
        //La funcion actualiza un producto existente en la lista cuyo id sea igual al 1er argumento dado y lo reemplaza por un objeto nuevo en el 2do argumento dado.
        const productos = await this.getProducts();
        productos[pid - 1] = updated

        fs.promises.writeFile(pathProductos, JSON.stringify(productos));
    }
    
    async deleteProduct(pid) {
        //la funcion borra un producto existente cuyo id sea igual al argumento dado.
        let productos = await this.getProducts();
        productos = productos.filter(product => product.id !== pid);

        fs.promises.writeFile(pathProductos, JSON.stringify(productos));
    }
}

module.exports = ProductManager;
