const net = require('net');
const fs = require('fs');
const path = require('path');

const connect = {host: "127.0.0.1", port: 3001};
const type = process.argv[2];
const pathFileOf = process.argv[3];
const pathFileIn = process.argv[4];
const key = 'asd456QQ';

const client = new net.Socket();
client.setEncoding('utf8');

client.connect(connect, function () {
    console.log('Connected');
    client.write('REMOTE');
});
client.on('error', (err) => {
    console.error(err);
});
client.on('close', function () {
    console.log('Connection closed');
});

client.on('data', function (data) {
    if (data === 'ASC' ) {
        console.log('Server is asc');
        client.write(type+'####'+pathFileOf+'####'+pathFileIn+'####'+key);
        client.destroy();
    }
    else {
        console.log('Server is dsc');
        client.destroy();
    }
});
