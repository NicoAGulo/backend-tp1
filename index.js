const ProductManager = require('./ProductManager.js')
const CartManager = require('./CartManager.js')

async function main(){
    //Se crea una instancia de cada clase para gestionar productos y carritos.
    const productManager= new ProductManager();
    const cartManager= new CartManager(productManager);

    //METODOS DE CARRITO:

    //Metodo para crear un nuevo carrito: createCart()
    await cartManager.createCart();

    //Metodo para verificar carritos existentes: getCarts()
    const detalleCarrito= await cartManager.getCarts();

    console.log("Listado de carritos:");
    console.log(detalleCarrito);

    //Metodo para verificar el listado de productos agregados al carrito elegido por su id: getCartById(carritoAVerificar)

    const carritoAVerificar1 = await cartManager.getCartById(1)
    const carritoAVerificar2 = await cartManager.getCartById(2)
    console.log("Se verifica el carrito con ID 1");
    console.log(carritoAVerificar1);
    console.log("Se verifica el carrito con ID 2");
    console.log(carritoAVerificar2);
    
    //Metodo para agregar un producto al carrito: addProductToCart(cid, pid)

    //manejar como objeto en backend
    await cartManager.addProductToCart(2,2);

    // //Metodo para verificar los productos disponibles
    // const listadoProductos= await productManager.getProducts();
    // // console.log(listadoProductos);
}

main();