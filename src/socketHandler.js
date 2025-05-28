import { cartManager } from "./routes/vistas.js";

export function socketHandlers(io) {
  io.on('connection', async (socket) => {
    const now = new Date();
    console.log("Usuario conectado a las: " + now.toLocaleTimeString());

    try {
      const ultimoCarrito = await cartManager.getCart();
      const productos = ultimoCarrito.products;
      const carritoId = ultimoCarrito.id;

      const productosAgrupados = productos.reduce((acc, producto) => {
        const productoExistente = acc.find(p => p.id === producto.id);
        if (productoExistente) {
          productoExistente.quantity += 1;
        } else {
          acc.push({ ...producto, quantity: 1 });
        }
        return acc;
      }, []);

      socket.emit('carritoActualizado', {
        carritoId,
        products: productosAgrupados
      });
    } catch (error) {
      console.error('Error al emitir el carrito inicial:', error);
    }

    socket.emit('Estudiante');

    // Agregar producto al carrito
    socket.on('agregarProducto', async ({ cid, pid }) => {
        console.log(`Recibido en el socket el CID: ${cid}, y el PID:${pid}`)




      try {
        await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
        socket.emit('productoAgregado', { success: true, pid });

        const carritoActualizado = await cartManager.getCartById(cid);
        io.emit('carritoActualizado', carritoActualizado);
        
      } catch (error) {
        socket.emit('productoAgregado', {
          success: false,
          error: "Error al agregar producto"
        });
      }
    });

    // Eliminar producto del carrito
    socket.on('eliminarProducto', async ({ cid, pid }) => {
      try {
        await cartManager.removeProductFromCart(parseInt(cid), parseInt(pid));
        socket.emit('productoEliminado', { success: true, pid });
      } catch (error) {
        socket.emit('productoEliminado', {
          success: false,
          error: "Error al eliminar producto"
        });
      }
    });
  });
}