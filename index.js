const ProductManager = require('./ProductManager.js')
const CartManager = require('./CartManager.js')

async function main(){
    //Se crea una instancia de cada clase para gestionar productos y carritos.
    const productManager= new ProductManager();
    const cartManager= new CartManager(productManager);

    //METODOS DE CARRITO:

    //Metodo para crear un nuevo carrito
    await cartManager.createCart();

    //Metodo para verificar carritos existentes: getCarts()
    const detalleCarrito= await cartManager.getCarts();

    console.log("Listado de carritos:");
    console.log(detalleCarrito);

    
    //Metodo para agregar un producto al carrito: addProductToCart(cid, pid)

    //manejar como objeto en backend
    await cartManager.addProductToCart(2,1);
    
    
    //Metodo para hacer referencia a un carrito en particular
    
    const carritoConIdX= await cartManager.getCartById(2);
    console.log("Consulta a carrito con ID Nro 2");
    console.log(carritoConIdX);

    //Metodo para verificar los productos disponibles
    const listadoProductos= await productManager.getProducts();
    // console.log(listadoProductos);
}

main();