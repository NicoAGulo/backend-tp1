import fs from 'node:fs'
import * as path from "path"
import __dirname from "./utils.js"
const pathProductos= path.join(__dirname, 'products.json'); //Ruta absoluta


//CREAR CLASE PRODUCTMANAGER E INTEGRARLE TODOS LOS METODOS (CRUD)

class ProductManager{
    constructor(){

        console.log("Ruta de products.json", pathProductos)
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
        fs.promises.writeFile(pathProductos, JSON.stringify(productos, null, 2));
    }
    
    async updateProduct(pid, updated) {
        //La funcion actualiza un producto existente en la lista cuyo id sea igual al 1er argumento dado y lo reemplaza por un objeto nuevo en el 2do argumento dado.
        const productos = await this.getProducts();

        const index = productos.findIndex(producto=> producto.id ===pid);


        productos[index] = {...productos[index], ...updated}

        await fs.promises.writeFile(pathProductos, JSON.stringify(productos, null, 2));
    }
    
    async deleteProduct(pid) {
        //la funcion borra un producto existente cuyo id sea igual al argumento dado.
        let productos = await this.getProducts();
        productos = productos.filter(product => product.id !== pid);

        fs.promises.writeFile(pathProductos, JSON.stringify(productos, null, 2));
    }
}

export default ProductManager