export const socketMiddleware = (req, res, next) => {
    // Asociar socket ID si viene en headers
    const socketId = req.headers['x-socket-id'];
    if (socketId) {
        req.socketId = socketId;
    }
    
    // Hacer io disponible en req
    req.io = req.app.get('io');
    next();
};

export const attachSocketIO = (io) => {
    return (req, res, next) => {
        req.io = io;
        next();
    };
};