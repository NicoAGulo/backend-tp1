const fs = require('fs'); //Para permitir el CRUD mediante sistema de archivos.
const path = require ('path'); //Para trabajar con rutas de forma segura.
const pathProductos= path.join(__dirname, 'products.json'); //Ruta absoluta


//CREAR CLASE PRODUCTMANAGER E INTEGRARLE TODOS LOS METODOS (CRUD)

class ProductManager{
    id;
    title;
    description;
    code;
    price;
    status;
    stock;
    category;
    thumbnails;

    constructor(title, description, code, price, status, stock, category, thumbnails){
        this.title= title;
        this.description= description;
        this.code= code;
        this.price= price;
        this.status= status;
        this.stock= stock;
        this.category= category;
        this.thumbnails= thumbnails;
    }


    //implementar correctamente a futuro con async/await
    async getProducts() {
        //La funcion retorna un listado de productos 
        const productos = await fs.promises.readFile(pathProductos, 'utf-8');
        return JSON.parse(productos);
    }
    
    getProductById(pid) {
        //La funcion retorna el producto en la lista cuyo id sea igual al argumento
        const productos = this.getProducts();
        return productos.find(producto => producto.id === pid)
    }
    
    addProduct(product) {
    
        //La funcion crea un nuevo producto y lo agrega al final de la lista de productos
        const productos = this.getProducts();
        productos.push(product);
        fs.writeFileSync(pathProductos, JSON.stringify(productos));
    }
    
    updateProduct(pid, updated) {
    
        //La funcion actualiza un producto existente en la lista cuyo id sea igual al 1er argumento dado y lo reemplaza por un objeto nuevo en el 2do argumento dado.
        const productos = this.getProducts();
        productos[pid - 1] = updated;
        fs.writeFileSync(pathProductos, JSON.stringify(productos));
    }
    
    deleteProduct(pid) {
    
        //la funcion borra un producto existente cuyo id sea igual al argumento dado.
        let productos = this.getProducts();
        productos = productos.filter(product => product.id !== pid);
        fs.writeFileSync(pathProductos, JSON.stringify(productos));
    }
}





module.exports = {
    ProductManager
}
