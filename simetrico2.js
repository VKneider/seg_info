import { writeFileSync, readFileSync } from 'fs';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { basename, extname, join } from 'path';

export default class Simetrico {
    constructor(inputFilePath, outputPath) {
        this.inputFilePath = inputFilePath;
        this.outputPath = outputPath;
        this.algorithm = '';
        this.key = '';
        this.iv = '';

        this.init();
    }

    init() {
        // Crear archivos de clave y vector inicial
        const baseFileName = basename(this.inputFilePath, extname(this.inputFilePath));
        const keyFileName = `${baseFileName}_key.txt`;
        const ivFileName = `${baseFileName}_iv.txt`;

        this.algorithm = 'aes-256-cbc'; // algoritmo de cifrado
        this.key = randomBytes(32).toString('hex'); // clave aleatoria de 32 bytes
        this.iv = randomBytes(16).toString('hex'); // vector inicial aleatorio de 16 bytes

        // Guardar clave y vector inicial en archivos
        writeFileSync(join(this.outputPath, keyFileName), this.key);
        writeFileSync(join(this.outputPath, ivFileName), this.iv);
    }

    encriptar() {
        const baseFileName = basename(this.inputFilePath, extname(this.inputFilePath));
        const outputFile = `${baseFileName}_encripted.pdf`;

        const inputBuffer = readFileSync(this.inputFilePath);
        const cipher = createCipheriv(this.algorithm, Buffer.from(this.key, 'hex'), Buffer.from(this.iv, 'hex'));
        const encryptedBuffer = Buffer.concat([cipher.update(inputBuffer), cipher.final()]);

        writeFileSync(join(this.outputPath, outputFile), encryptedBuffer);
        console.log(`Archivo encriptado y guardado como ${outputFile}`);
    }

    desencriptar() {
        const baseFileName = basename(this.inputFilePath, extname(this.inputFilePath));
        const keyFilePath = join(this.outputPath, `${baseFileName}_key.txt`);
        const ivFilePath = join(this.outputPath, `${baseFileName}_iv.txt`);
        const outputFile = `${baseFileName}_desencriptado.pdf`;

        const encryptedBuffer = readFileSync(join(this.outputPath, `${baseFileName}_encripted.pdf`));
        const key = readFileSync(keyFilePath, 'utf8').trim();
        const iv = readFileSync(ivFilePath, 'utf8').trim();

        const decipher = createDecipheriv(this.algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        const decryptedBuffer = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

        writeFileSync(join(this.outputPath, outputFile), decryptedBuffer);
        console.log(`Archivo desencriptado y guardado como ${outputFile}`);
    }
}

// Ejemplo de uso
const inputFilePath = 'input.pdf'; // Ruta al archivo PDF a encriptar
const outputPath = './output_simetrico/'; // Ruta donde se guardarán los archivos generados

const simetrico = new Simetrico(inputFilePath, outputPath);
simetrico.encriptar();
simetrico.desencriptar();