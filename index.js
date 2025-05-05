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
    await cartManager.addProductToCart(2,2);




    //METODOS DE PRODUCTOS

    //Metodo de listado de productos
    const productosDisponibles = await productManager.getProducts();
    console.log(productosDisponibles)

    //Metodo de verificacion de producto con id X
    const productoDisponible = await productManager.getProductById(3);
    console.log(productoDisponible)

    //Metodo para agregar producto al listado de productos
    const productoNuevo = {
        "id": 99,
        "title": "Producto Nuevo Agregado",
        "description": "Este es un producto agregado que se creo para una prueba.",
        "code": "ABC123",
        "price": 123456,
        "status": false,
        "stock": 1,
        "category": "Random",
        "thumbnails": []
      };
    await productManager.addProduct(productoNuevo);

    //Metodo para editar un producto de la lista
    const productoOriginal= await productManager.getProductById(99);
    const productoEditado={
        ...productoOriginal,
        title: "PRODUCTO NUEVO EDITADO",
        price:11111
    };
    await productManager.updateProduct(99,productoEditado);
    console.log("Producto con ID:99 Editado")


    //Metodo para eliminar un producto de la lista de productos:
    await productManager.deleteProduct(99);
    console.log("Producto con ID:99 eliminado de la lista de productos.")


}

main();