const socket = io();

// Variables globales
let socketId = null;

// Configurar eventos de socket
socket.on('connect', () => {
    socketId = socket.id;
    console.log('Conectado al servidor:', socketId);
});

socket.on('clienteConectado', (data) => {
    console.log('Cliente conectado:', data);
    // Solicitar lista inicial de archivos
    socket.emit('solicitarListaArchivos');
});

socket.on('archivoSubido', (fileInfo) => {
    console.log('Archivo subido:', fileInfo);
    mostrarNotificacion(`${fileInfo.nombreOriginal} subido exitosamente`);
    actualizarListaArchivos();
});

socket.on('archivoEliminado', (data) => {
    console.log('Archivo eliminado:', data);
    mostrarNotificacion(`${data.archivo} eliminado`);
    actualizarListaArchivos();
});

socket.on('errorSubida', (error) => {
    console.error('Error en subida:', error);
    mostrarError(`${error.mensaje}`);
});

socket.on('listaArchivos', (data) => {
    console.log('Lista de archivos recibida:', data);
    renderizarListaArchivos(data.archivos);
});

function solicitarArchivos() {
    socket.emit('getFiles');
}

function eliminarArchivo(filename) {
    socket.emit('deleteFile', { filename });
}


// Funciones de utilidad
function mostrarNotificacion(mensaje) {
    // Implementar tu sistema de notificaciones
    console.log('Notificación:', mensaje);
}

function mostrarError(mensaje) {
    // Implementar tu sistema de errores
    console.error('Error:', mensaje);
}

function actualizarListaArchivos() {
    socket.emit('solicitarListaArchivos');
}

function renderizarListaArchivos(archivos) {
    // Implementar renderizado de la lista
    console.log('Renderizando archivos:', archivos);
}

// Función para subir archivo
async function subirArchivo(formData) {
    try {
        // Agregar socket ID para notificaciones específicas
        const response = await fetch('/vistas/upload', {
            method: 'POST',
            headers: {
                'X-Socket-Id': socketId
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        return result;
        
    } catch (error) {
        console.error('Error subiendo archivo:', error);
        mostrarError(error.message);
        throw error;
    }
}

// Exportar funciones si es necesario
export { subirArchivo, actualizarListaArchivos };