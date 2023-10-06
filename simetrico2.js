import { writeFileSync, readFileSync } from 'fs';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { basename, extname, join } from 'path';

export default class Simetrico {
    constructor(inputFilePath, outputPath) {
        this.inputFilePath = inputFilePath;
        this.outputPath = outputPath;
        this.algorithm = 'aes-256-cbc';
        this.key = '';
        this.iv = '';
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
        this.init();
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

        //remove "_encripted" from file name
        const baseFileName2 = baseFileName.replace("_encripted", "");
        console.log(baseFileName2)
        const keyFilePath = join(this.outputPath, `${baseFileName2}_key.txt`);
        const ivFilePath = join(this.outputPath, `${baseFileName2}_iv.txt`);
        const outputFile = `${baseFileName}_desencriptado.pdf`;

        const encryptedBuffer = readFileSync(join(this.outputPath, `${baseFileName}.pdf`));
        const key = readFileSync(keyFilePath, 'utf8').trim();
        const iv = readFileSync(ivFilePath, 'utf8').trim();

        const decipher = createDecipheriv(this.algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        const decryptedBuffer = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

        writeFileSync(join(this.outputPath, outputFile), decryptedBuffer);
        console.log(`Archivo desencriptado y guardado como ${outputFile}`);
    }
}

/*
const simetrico = new Simetrico('./files/MINERIA.pdf', './output_simetrico/');
simetrico.encriptar();
*/