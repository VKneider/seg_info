import { createPublicKey, publicEncrypt, createPrivateKey, privateDecrypt } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { basename, extname, join } from 'path';

export default class Asimetrico {
    constructor(inputFilePath, outputPath, llavePublicaPath, llavePrivadaPath) {
        this.inputFilePath = inputFilePath;
        this.outputPath = outputPath;
        this.llavePublicaPath = llavePublicaPath;
        this.llavePrivadaPath = llavePrivadaPath;
    }

    encriptar() {
        const baseFileName = basename(this.inputFilePath, extname(this.inputFilePath));
        const outputFile = `${baseFileName}_encriptado.txt`;

        // Lee el contenido del archivo que deseas encriptar
        const archivoParaEncriptar = readFileSync(this.inputFilePath);

        // Lee la llave pública
        const llavePublica = readFileSync(this.llavePublicaPath, 'utf8');

        // Crea un objeto crypto con la llave pública
        const encriptador = createPublicKey(llavePublica);

        // Encripta el archivo usando la llave pública
        const archivoEncriptado = publicEncrypt(encriptador, archivoParaEncriptar);

        // Guarda el archivo encriptado en un nuevo archivo
        writeFileSync(join(this.outputPath, outputFile), archivoEncriptado);

        console.log(`Archivo encriptado y guardado como ${outputFile}`);
    }

    desencriptar() {
        const baseFileName = basename(this.inputFilePath, extname(this.inputFilePath));
        console.log(baseFileName);
        const outputFile = `${baseFileName}_desencriptado.txt`;

        // Lee el contenido del archivo encriptado
        const archivoEncriptado = readFileSync(this.inputFilePath);

        // Lee la llave privada
        const llavePrivada = readFileSync(this.llavePrivadaPath, 'utf8');

        // Crea un objeto crypto con la llave privada
        const desencriptador = createPrivateKey(llavePrivada);

        // Desencripta el archivo usando la llave privada
        const archivoDesencriptado = privateDecrypt(desencriptador, archivoEncriptado);

        // Guarda el archivo desencriptado en un nuevo archivo
        writeFileSync(join(this.outputPath, outputFile), archivoDesencriptado);

        console.log(`Archivo desencriptado y guardado como ${outputFile}`);
    }
}


const outputPath = './output_asimetrico/';
const inputFilePath = "./files/hola.txt"
const llavePublicaPath = "./keys/public_key.pem"
const llavePrivadaPath = "./keys/private_key.pem"

const asimetricoModulo = new Asimetrico(inputFilePath, outputPath, llavePublicaPath, llavePrivadaPath);
asimetricoModulo.encriptar();
asimetricoModulo.desencriptar();