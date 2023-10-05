const selfsigned = require('selfsigned');
const fs = require('fs');

const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

fs.writeFileSync('localhost-key.pem', pems.private);
fs.writeFileSync('localhost-cert.pem', pems.cert);


