import { cartManager } from "./routes/vistas.js";
import { productManager } from "./routes/vistas.js";

export function socketHandlers(io) {

  //INSTANCIA DE IO
  io.on('connection', async (socket) => {
    const now = new Date();
    console.log("Usuario conectado a las: " + now.toLocaleTimeString());
    socket.emit('clienteConectado', {
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });

    //CONTROLADORES DE INSTANCIA DE SOCKET
    socket.on('unirseASala', (sala) => {
      socket.join(sala);
      socket.emit('unidoASala', { sala, socketId: socket.id });
    });

    socket.on('iniciarSubida', (fileInfo) => {
      socket.emit('progresoSubida', {
        archivo: fileInfo.nombre,
        progreso: 0,
        estado: 'iniciando'
      });
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });

    socket.on('productoAgregado', (data) => {
      if (data.success) {
        alert(`Producto agregado con éxito (ID: ${data.pid})`);
      } else {
        alert(`Error al agregar producto: ${data.error}`);
      }
    });
    
    
    
    //Metodos de Managers

    //GET PREDETERMINADO PARA MOSTRAR LISTAS
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
      console.error('Error al mostrar el carrito inicial:', error);
    }

    // ====== EVENTOS DEL CARRITO ======
    socket.on('agregarProducto', async ({ cid, pid }) => {
        console.log(`Recibido en el socket el CID: ${cid}, y el PID:${pid}`)

        const resultado = await cartManager.addProductToCart(parseInt(cid), parseInt(pid))

        if (resultado.success){
          // CAMBIO: Usar el evento específico para carrito
          socket.emit('productoAgregadoCarrito', {success: true, pid});

          const carritoActualizado = await cartManager.getCartById(cid)
          io.emit('carritoActualizado', carritoActualizado);
        }else{
          // CAMBIO: Usar el evento específico para carrito
          socket.emit('productoAgregadoCarrito', {
            success: false,
            message: resultado.message || "Error al agregar el producto"
          })
        }
    });

    socket.on('eliminarProducto', async ({ cid, pid }) => {
      try {
        await cartManager.removeProductFromCart(parseInt(cid), parseInt(pid));
        // CAMBIO: Usar el evento específico para carrito
        socket.emit('productoEliminadoCarrito', { success: true, pid });
      } catch (error) {
        // CAMBIO: Usar el evento específico para carrito
        socket.emit('productoEliminadoCarrito', {
          success: false,
          message: "Error al eliminar producto"
        });
      }
    });

    // ====== EVENTOS DE ARCHIVOS ======
    socket.on('uploadFile', async (fileData)=>{
      
      try{
        if (!fileData || !fileData.filename || !fileData.path) {
                    const error = { mensaje: 'Datos de archivo incompletos' };
                    socket.emit('errorSubida', error);
                    return;
                }

        const fileStats= await fs.stat(fileData.path);

        const fileInfo ={
          id: Date.now(),
          nombre: fileData.filename,
          nombreOriginal: fileData.originalname,
          tamano: fileStats.size,
          mimetype: fileData.mimetype,
          ruta: fileData.path,
          fechaSubida: new Date().toISOString(),
          socketId: socket.id
        };

        socket.emit('archivoSubido', fileInfo); 
        io.emit('nuevoArchivo', fileInfo);

        console.log('Archivo procesado exitosamente:', fileInfo.nombre);
      
      } catch(error){
        console.error('Error procesando archivo', error);

        const errorInfo = {
          mensaje: 'Error interno al procesar archivo',
          timestamp: new Date().toISOString(),
          error: error.message,
          socketId: socket.id
        };

        socket.emit('errorSubida', errorInfo);
      }
    });

    socket.on('getFiles', async ()=>{
      try{
        const files = await fs.readdir('./uploads');
        const fileDetails = await Promise.all (
          files.map(async (file) =>{
            const filePath = path.join('./uploads', file);
            const stats= await fs.stat(filePath);
            return{
              nombre: file,
              tamano: stats.size,
              fechaModificacion: stats.mtime
            };
          })
        );

        socket.emit('listaArchivos', {
          success: true,
          archivos: fileDetails,
          total: fileDetails.length
        });

      }catch (error){
        console.error('Error obteniendo archivos:', error);
        socket.emit('errorListaArchivos', {
          success: false,
          error: 'Error al obtener lista de archivos',
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('deleteFile', async ({filename})=>{
      try{
        if(!filename){
          socket.emit('errorEliminacion', {
            success: false,
            error: 'Nombre de archivo requerido'
          });
          return;
        }

        const {filename} = req.params;
        const filePath = path.join('./uploads', filename);

        await fs.access(filePath);
        await fs.unlink(filePath);

        const deleteInfo = {
          archivo: filename,
          timestamp: new Date().toISOString(),
          eliminadoPor: socket.id
        };

        io.emit('archivoEliminado', deleteInfo);

        socket.emit('eliminacionExitosa', {
          success: true,
          mensaje: 'Archivo eliminado exitosamente',
          archivo: filename
        });

      }catch (error){
        console.error('Error eliminando archivo:', error);

        socket.emit('errorEliminacion', {
          success: false,
          error: 'Error al eliminar archivo',
          details: error.message
        });
      }
    });

    // ====== EVENTOS DE PRODUCTOS - LISTA PRINCIPAL ======
    
    // ENVIAR LISTA INICIAL DE PRODUCTOS AL CONECTARSE
    try {
      const productos = await productManager.getProducts();
      // CAMBIO: Usar evento específico para lista inicial
      socket.emit('listaProductos', {
        success: true,
        productos: productos,
        total: productos.length
      });
    } catch (error) {
      console.error('Error al cargar productos iniciales:', error);
      socket.emit('errorProducto', {
        success: false,
        error: 'Error al cargar productos'
      });
    }

    // AGREGAR NUEVO PRODUCTO A LA LISTA
    socket.on('agregarProductoRealTime', async (productData) => {

      const productos = await productManager.getProducts();
      // Generar id único
      let nuevoId = Date.now();
      while (productos.some(p => String(p.id) === String(nuevoId))) {
          nuevoId++;
      }
      productData.id = nuevoId;

      try {
        console.log('Agregando producto via WebSocket:', productData);
        
        const nuevoProducto = await productManager.addProduct(productData);
        
        if (nuevoProducto) {
          // Obtener lista actualizada
          const productosActualizados = await productManager.getProducts();
          
          // CAMBIO: Emitir evento específico para agregar a lista
          socket.emit('productoAgregadoLista', {
            success: true,
            productos: productosActualizados,
            producto: nuevoProducto,
            message: 'Producto agregado exitosamente a la lista'
          });
          
          // Notificar a otros clientes (opcional)
          io.emit('productosActualizados', {
            success: true,
            productos: productosActualizados,
            total: productosActualizados.length,
            accion: 'agregado',
            productoAfectado: nuevoProducto
          });
          
          // Mantener evento legacy por compatibilidad
          socket.emit('productoAgregadoExito', {
            success: true,
            producto: nuevoProducto,
            mensaje: 'Producto agregado exitosamente'
          });
          
        } else {
          socket.emit('productoAgregadoLista', {
            success: false,
            message: 'No se pudo agregar el producto'
          });
        }
        
      } catch (error) {
        console.error('Error agregando producto:', error);
        socket.emit('productoAgregadoLista', {
          success: false,
          message: error.message || 'Error al agregar producto'
        });
      }
    });

    // ELIMINAR PRODUCTO DE LA LISTA
    socket.on('eliminarProductoRealTime', async (productId) => {
      try {
        console.log('Eliminando producto via WebSocket, ID:', productId);
        
        const resultado = await productManager.deleteProduct(parseInt(productId));
        
        if (resultado) {
          // Obtener lista actualizada
          const productosActualizados = await productManager.getProducts();
          
          // CAMBIO: Emitir evento específico para eliminar de lista
          socket.emit('productoEliminadoLista', {
            success: true,
            productos: productosActualizados,
            productoId: productId,
            message: 'Producto eliminado exitosamente de la lista'
          });
          
          // Notificar a otros clientes (opcional)
          io.emit('productosActualizados', {
            success: true,
            productos: productosActualizados,
            total: productosActualizados.length,
            accion: 'eliminado',
            productoEliminadoId: productId
          });
          
          // Mantener evento legacy por compatibilidad
          socket.emit('productoEliminadoExito', {
            success: true,
            mensaje: 'Producto eliminado exitosamente',
            productoId: productId
          });
          
        } else {
          socket.emit('productoEliminadoLista', {
            success: false,
            message: 'No se pudo eliminar el producto - Producto no encontrado'
          });
        }
        
      } catch (error) {
        console.error('Error eliminando producto:', error);
        socket.emit('productoEliminadoLista', {
          success: false,
          message: error.message || 'Error al eliminar producto'
        });
      }
    });

    // SOLICITAR LISTA DE PRODUCTOS ACTUALIZADA
    socket.on('solicitarProductos', async () => {
      try {
        const productos = await productManager.getProducts();
        // CAMBIO: Usar evento específico para lista solicitada
        socket.emit('listaProductos', {
          success: true,
          productos: productos,
          total: productos.length
        });
      } catch (error) {
        console.error('Error al solicitar productos:', error);
        socket.emit('errorProducto', {
          success: false,
          error: 'Error al obtener productos'
        });
      }
    });

    // Evento de desconexión (no duplicar)
    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
}

export const notificarATodos = (io, evento, data) => {
    io.emit(evento, {
        ...data,
        timestamp: new Date().toISOString()
    });
};

export const notificarASala = (io, sala, evento, data) => {
    io.to(sala).emit(evento, {
        ...data,
        timestamp: new Date().toISOString()
    });
};