import express from 'express';
import { createServer } from 'https';
import multer from 'multer';
import { readFileSync} from 'fs';
import { writeFile } from 'fs/promises';
const app = express();
const PORT = process.env.PORT || 443;

import Simetrico from './simetrico2.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



const options = {
  key: readFileSync('localhost-key.pem'),
  cert: readFileSync('localhost-cert.pem'),
};


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

app.post("/simetrico", upload.single('file'), async (req, res) => {
  const file = req.file; // Contiene la información del archivo subido

  try {
    await writeFile('./uploads/' + file.originalname, file.buffer);
    const inputFilePath = './uploads/' + file.originalname; // Ruta al archivo PDF a encriptar
    const outputPath = './output_simetrico/'; // Ruta donde se guardarán los archivos generados
    const simetricoModulo = new Simetrico(inputFilePath, outputPath);
    
    simetricoModulo.desencriptar();
    res.json({ message: 'Archivo recibido exitosamente', success: true});
  } catch (err) {
    console.error('Error al guardar el archivo:', err);
    res.status(500).json({ error: 'Error al guardar el archivo' });
  }
});

const httpsServer = createServer(options, app);

httpsServer.listen(PORT, () => {
  console.log(`Servidor HTTPS escuchando en el puerto ${PORT}`);
});
