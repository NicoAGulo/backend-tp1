const ProductManager = require('./ProductManager.js')
const CartManager = require('./CartManager.js')



async function main(){
    //Se crea una instancia de cada clase para gestionar productos y carritos.
    const productManager= new ProductManager();
    const cartManager= new CartManager(productManager);


//METODOS DE CARRITO:


//BOTON PARA VISUALIZAR CARRITOS (CARTS_GET)
//     //Metodo para verificar carritos existentes: getCarts()
//     const detalleCarrito= await cartManager.getCarts();
//     console.log("Listado de carritos:");
//     console.log(detalleCarrito);

    //CREAR NUEVA INSTANCIA: (POST DEL SERVER)
    const cart = await cartManager.createCart();
    //Metodo para crear un nuevo carrito: createCart()

    //METODO GET A CARRITO
    
    
//     //Metodo para agregar un producto al carrito: addProductToCart(cid, pid) ADD_ITEM
//     await cartManager.addProductToCart(2,2);




//     //METODOS DE PRODUCTOS

//     //Metodo de listado de productos (ITEM_LIST)
//     const productosDisponibles = await productManager.getProducts();
//     console.log(productosDisponibles)

//     //Metodo de verificacion de producto con id X (ITEM_STOCK)
//     const productoDisponible = await productManager.getProductById(3);
//     console.log(productoDisponible)

//     //Metodo para agregar producto al listado de productos (NEW_ITEM)
//     const productoNuevo = {
//         "id": 99,
//         "title": "Producto Nuevo Agregado",
//         "description": "Este es un producto agregado que se creo para una prueba.",
//         "code": "ABC123",
//         "price": 123456,
//         "status": false,
//         "stock": 1,
//         "category": "Random",
//         "thumbnails": []
//       };
//     await productManager.addProduct(productoNuevo);

//     //Metodo para editar un producto de la lista
//     const productoOriginal= await productManager.getProductById(99); (ITEM_PUT)
//     const productoEditado={
//         ...productoOriginal,
//         title: "PRODUCTO NUEVO EDITADO",
//         price:11111
//     };
//     await productManager.updateProduct(99,productoEditado);
//     console.log("Producto con ID:99 Editado")


//     //Metodo para eliminar un producto de la lista de productos: (ITEM_DELETE)
//     await productManager.deleteProduct(99);
//     console.log("Producto con ID:99 eliminado de la lista de productos.")


// }

// main();

}