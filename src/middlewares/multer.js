import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';




const storage = multer.diskStorage({
    destination: async (req,file,cb)=>{
        try {
            await fs.access('./uploads')
            cb(null, 'uploads/') //carpeta upload disponible?

        }catch(error){
            await fs.mkdir('./uploads', {recursive: true});
            cb(null, 'uploads/')

        }
    },
    filename: (req, file, cb)=>{
        const uniqueName=Date.now() + file.originalname;
        cb(null, uniqueName);
    }
});


const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /json/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    }
});

export default upload;