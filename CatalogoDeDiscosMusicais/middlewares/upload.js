import multer from 'multer';
import path from 'path';

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Define a pasta onde os arquivos serão salvos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nome único para evitar conflitos
    }
});

// Configuração do filtro de tipos de arquivos
const fileFilter = (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png/;
    const audioTypes = /mp3|m4a|ogg|wav/;
    const isImage = imageTypes.test(path.extname(file.originalname).toLowerCase());
    const isAudio = audioTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = imageTypes.test(file.mimetype) || audioTypes.test(file.mimetype);

    if ((isImage || isAudio) && mimetype) {
        return cb(null, true); // Arquivo válido
    } else {
        cb(new Error('Formato de arquivo inválido! Somente JPEG, JPG, PNG, MP3, M4A, OGG ou WAV são permitidos.')); // Erro de formato
    }
};

// Configuração do `multer`
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export const handleFileUpload = (fields) => (req, res, next) => {
    const uploadMiddleware = upload.fields(fields);
    uploadMiddleware(req, res, function (err) {
        if (err) {
            req.flash('error_msg', err.message);
            return res.redirect('/discos/adicionarDiscos');
        }
        next();
    });
};

export default upload;