const fs = require('fs'); //Para permitir el CRUD mediante sistema de archivos.
const path = require ('path'); //Para trabajar con rutas de forma segura.
const pathProductos= path.join(__dirname, 'products.json'); //Ruta absoluta


//CREAR CLASE PRODUCTMANAGER E INTEGRARLE TODOS LOS METODOS (FUNCIONES)



function getProducts() {
    //La funcion retorna un listado de productos 
    const productos = fs.readFileSync(pathProductos, 'utf-8');
    return JSON.parse(productos);
}

function getProductById(pid) {
    //La funcion retorna el producto en la lista cuyo id sea igual al argumento
    const productos = getProducts();
    return productos.find(producto => producto.id === pid)
}

function addProduct(product) {

    //La funcion crea un nuevo producto y lo agrega al final de la lista
    const productos = getProducts();
    productos.push(product);
    fs.writeFileSync(pathProductos, JSON.stringify(productos));
}

function updateProduct(pid, updated) {

    //La funcion actualiza un producto existente en la lista cuyo id sea igual al 1er argumento dado y le otorga la informacion nueva del 2do argumento dado.
    const productos = getProducts();
    productos[pid - 1] = updated;
    fs.writeFileSync(pathProductos, JSON.stringify(productos));
}

function deleteProduct(pid) {

    //la funcion borra un producto existente cuyo id sea igual al argumento dado.
    let productos = getProducts();
    productos = productos.filter(product => product.id !== pid);
    fs.writeFileSync(pathProductos, JSON.stringify(productos));
}

module.exports = {
    getProducts,        //Read
    getProductById,     //Read
    addProduct,         //Create
    updateProduct,      //Udpate
    deleteProduct       //Delete
}
