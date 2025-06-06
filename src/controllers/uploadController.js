import { promises as fs } from 'fs';
import path from 'path';

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            const error = { mensaje: 'No se recibió ningún archivo' };
            
            // Notificar error via WebSocket
            req.io.emit('errorSubida', error);
            
            return res.status(400).json({ 
                success: false,
                error: error.mensaje 
            });
        }

        // Obtener información del archivo
        const fileStats = await fs.stat(req.file.path);
        
        const fileInfo = {
            id: Date.now(),
            nombre: req.file.filename,
            nombreOriginal: req.file.originalname,
            tamano: fileStats.size,
            mimetype: req.file.mimetype,
            ruta: req.file.path,
            fechaSubida: new Date().toISOString(),
            usuario: req.userId || 'anonimo'
        };

        // 🔥 NOTIFICAR VIA WEBSOCKET
        if (req.socketId) {
            // Notificar solo al cliente específico
            req.io.to(req.socketId).emit('archivoSubido', fileInfo);
        } else {
            // Notificar a todos los clientes conectados
            req.io.emit('archivoSubido', fileInfo);
        }

        // Respuesta HTTP
        res.json({
            success: true,
            mensaje: 'Archivo subido exitosamente',
            archivo: fileInfo
        });
        
    } catch (error) {
        console.error('Error subiendo archivo:', error);
        
        const errorInfo = {
            mensaje: 'Error interno al subir archivo',
            timestamp: new Date().toISOString(),
            error: error.message
        };
        
        // Notificar error via WebSocket
        req.io.emit('errorSubida', errorInfo);
        
        res.status(500).json({ 
            success: false,
            error: errorInfo.mensaje 
        });
    }
};

export const getFiles = async (req, res) => {
    try {
        const files = await fs.readdir('./uploads');
        const fileDetails = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join('./uploads', file);
                const stats = await fs.stat(filePath);
                return {
                    nombre: file,
                    tamano: stats.size,
                    fechaModificacion: stats.mtime
                };
            })
        );

        res.json({
            success: true,
            files: fileDetails  // <-- Cambiar "archivos" por "files"
        });
        
    } catch (error) {
        console.error('Error obteniendo archivos:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener lista de archivos' 
        });
    }
};

export const readFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join('./uploads', filename);
        
        // Verificar que el archivo existe y está en uploads
        await fs.access(filePath);
        
        // Leer contenido del archivo
        const contenido = await fs.readFile(filePath, 'utf8');
        
        // Si es JSON, parsearlo para verificar que es válido
        let data = contenido;
        if (filename.endsWith('.json')) {
            try {
                data = JSON.parse(contenido);
            } catch (parseError) {
                console.error('Error parseando JSON:', parseError);
                // Si no se puede parsear, devolver como texto
                data = contenido;
            }
        }
        
        const fileInfo = {
            archivo: filename,
            contenido: data,
            tipo: filename.split('.').pop().toLowerCase(),
            timestamp: new Date().toISOString()
        };
        
        // Notificar lectura via WebSocket (opcional)
        if (req.io) {
            req.io.emit('archivoLeido', { archivo: filename, timestamp: fileInfo.timestamp });
        }
        
        res.json({
            success: true,
            ...fileInfo
        });
        
    } catch (error) {
        console.error('Error leyendo archivo:', error);
        
        let errorMessage = 'Error al leer archivo';
        if (error.code === 'ENOENT') {
            errorMessage = 'Archivo no encontrado';
        } else if (error.code === 'EACCES') {
            errorMessage = 'Sin permisos para leer el archivo';
        }
        
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
};

export const deleteFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join('./uploads', filename);
        
        // Verificar que el archivo existe
        await fs.access(filePath);
        
        // Eliminar archivo
        await fs.unlink(filePath);
        
        const deleteInfo = {
            archivo: filename,
            timestamp: new Date().toISOString()
        };
        
        // Notificar eliminación via WebSocket
        req.io.emit('archivoEliminado', deleteInfo);
        
        res.json({
            success: true,
            mensaje: 'Archivo eliminado exitosamente'
        });
        
    } catch (error) {
        console.error('Error eliminando archivo:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al eliminar archivo' 
        });
    }
};