export const socketMiddleware = (req, res, next) => {
    // Asociar socket ID si viene en headers
    console.log('socketMiddleware ejecutandose...')
    const socketId = req.headers['x-socket-id'];
    if (socketId) {
        req.socketId = socketId;
        console.log('sockedId encontrado:', socketId)
    }

    // Hacer io disponible en req
    req.io = req.app.get('io');
    next();
};