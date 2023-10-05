import express, { json } from 'express';
import { createServer } from 'https';
import { readFileSync } from 'fs';

//imports for dirname and path
import { dirname } from 'path';
import { fileURLToPath } from 'url';
//import Simetrico from './simetrico2';


const app = express();
const PORT = process.env.PORT || 443; // Puerto HTTPS estándar

// Middleware de ejemplo
app.use(json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

// Configuración de los certificados
const options = {
  key: readFileSync('localhost-key.pem'),
  cert: readFileSync('localhost-cert.pem'),
};


app.post("/simetrico", (req, res) => {
  

const outputPath = './output_simetrico/'; // Ruta donde se guardarán los archivos generados
const uploads = './uploads/';

//the request.body has a formData, it will have one key that is the name of the file and the value will be the file itself. I need to get the value of the key itself


let data = req.body;
console.log(data)

//const simetrico = new Simetrico(inputFilePath, outputPath);
});

// Creación del servidor HTTPS
const httpsServer = createServer(options, app);

// Iniciar el servidor
httpsServer.listen(PORT, () => {
  console.log(`Servidor HTTPS escuchando en el puerto ${PORT}`);
});

