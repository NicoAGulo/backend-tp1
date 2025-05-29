import { cartManager } from "./routes/vistas.js";

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

    socket.on('agregarProducto', async ({ cid, pid }) => {
        console.log(`Recibido en el socket el CID: ${cid}, y el PID:${pid}`)

        const resultado = await cartManager.addProductToCart(parseInt(cid), parseInt(pid))

        if (resultado.success){
          socket.emit('productoAgregado', {success: true, pid});

          const carritoActualizado =await cartManager.getCartById(cid)
          io.emit('carritoActualizado', carritoActualizado);
        }else{
          socket.emit('productoAgregado', {
            success: false,
            error: resultado.message || "Error al agregar el producto"
          })
        }
    });

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





    socket.on('uploadFile', async ({ req, res})=>{
      try{
        if (!req.file){
          const error = {mensaje: 'No se recibio ningun archivo'};
          
          req.io.emit('errorSubida', error);
          
          return res.status(400).json({
            success: false,
            error:error.mensaje
          });
        }
        const fileStats= await fs.stat(req.file.path);

        const fileInfo ={
          id: Date.now(),
          nombre: req.file.filename,
          nombreOriginal: req.file.nombreOriginal,
          tamano: fileStats.size,
          mimetype: req.file.mimetype,
          ruta: req.file.path,
          fechaSubida: new Date().toISOString(),
        }
        
        if (req.socketId){
          req.io.to(req.socketId).emit('archivoSubido', fileInfo);
        }else{
          req.io.emit ('archivoSubido', fileInfo)
        }

        res.json({
          success: true,
          mensaje: 'Archivo subido exitosamente',
          archivo: fileInfo
        });

        
      
      } catch(error){
        console.error('Error interno al subir archivo', error);

        const errorInfo = {
          mensaje: 'Error interno al subir archivo',
          timestamp: new Date().toISOString(),
          error: error.message
        };

        req.io.emit('errorSubida', errorInfo);

        res.status(500).json({
          success: false,
          error: errorInfo.mensaje
        });
      }
    })
    socket.on('getFiles', async ({req, res})=>{
      try{
        const files = await fs.readdir('./uploads');
        const fileDetails = await Promise.all (
          files.map(async (file =>{
            const filePath = path.join('./uploads', file);
            const stats= fs.stat(filePath);
            return{
              nombre: file,
              tamano: stats.size,
              fechaModificacion: stats.mtime
            };
          }))
        )
        res.json({
          success: true,
          archivos: fileDetails
        });
      }catch (error){
        console.error('Error obteniendo archivos:', error);
        res.status(500).json({
          success: false,
          error: 'Error al obtener lista de archivos'
        });
      }
    })
    socket.on('deleteFile', async ({req, res})=>{
      try{
        const {filename} = req.params;
        const filePath = path.join('./uploads', filename);

        await fs.access(filePath);

        await fs.unlink(filePath);

        const deleteInfo = {
          archivo: filename,
          timestamp: new Date().toISOString()
        };

        req.io.emit('archivoEliminado', deleteInfo);

        res.json({
          success:true,
          mensaje: 'Archivo eliminado exitosamente'
        });
      }catch (error){
        console.error('Error eliminando archivo:', error);
        res.status(500).json({
          success: false,
          error: 'Error al eliminar archivo'
        });
      }
    })



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