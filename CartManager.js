const fs = require('fs'); //Para permitir el CRUD mediante sistema de archivos.
const path = require ('path'); //Para trabajar con rutas de forma segura.
const { getProductById } = require('./ProductManager');
const pathCarritos= path.join(__dirname, 'carts.json'); //Ruta absoluta

//CREAR CLASE CARTMANAGER E INTEGRARLE TODOS LOS METODOS(FUNCIONES):


function getCarts(){
    //La funcion retorna un listado de carritos
    const carritos =fs.readFileSync(pathCarritos, 'utf-8');
    return JSON.parse(carritos);
}

function getCartById(cid){
    //La funcion retorna el carrito en la lista cuyo id sea igual al argumento
    const carritos = getCarts();
    return carritos.find(carrito => carrito.id ===cid);
}

function createCart(cart){
    //La funcion crea un nuevo carrito y lo agrega al final de la lista

    const carritos =getCarts();
    carritos.push(cart);
    fs.writeFileSync(pathCarritos, JSON.stringify(carritos));
}

function addProductToCart(cid, pid){
    //La funcion agrega al final de la lista del carrito cuyo id sea igual al 1er argumento el producto cuyo id sea igual al 2do argumento
    
    const listaCarritos= getCarts();
    const carrito= getCartById(cid);
    const producto= getProductById(pid);

    carrito.push(producto);

    fs.writeFileSync(pathCarritos, JSON.stringify(listaCarritos));
}