import { BrowserWindow } from 'electron';
import { Bonjour } from 'bonjour-service';
const instance = new Bonjour();

// const dgram = require('node:dgram');
// const server = dgram.createSocket('udp4');

export function setupUtpListener(mainWindow: BrowserWindow) {
  // advertise an HTTP server on port 3000
  instance.publish({
    name: 'Hey there', // Name of your device
    type: 'http', // Service type
    protocol: 'tcp', // Protocol type
    port: 80, // Service port

    host: 'benajas-macbook.local', // Hostname
    txt: { path: '/' }, // Additional metadata
  });

  instance.find({ type: 'http' }, function (service) {
    // console.log('Found an HTTP server:', service);
  });

  // // browse for all http services
  // instance.find({ type: 'http' }, function (service) {
  //   console.log('Found an HTTP server:', service);
  // });
  // server.on('error', (err) => {
  //   console.error(`server error:\n${err.stack}`);
  //   server.close();
  // });
  // server.on('message', (msg, rinfo) => {
  //   console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  //   const message = Buffer.from('Here I am');
  //   server.send(message, 0, message.length, rinfo.port, rinfo.address, (error) => {
  //     console.log('error', error);
  //   });
  //   mainWindow.webContents.send('newCammeraConnected', rinfo.address);
  //   // server.send(message, rinfo.port, '192.168.10.180', (error) => {
  //   //   console.log('error', error);
  //   // });
  // });
  // setInterval(() => {
  //   mainWindow.webContents.send('newCammeraConnected', 'test ip');
  // }, 2000);
  // server.on('listening', () => {
  //   const address = server.address();
  //   console.log(`server listening ${address.address}:${address.port}`);
  //   server.setBroadcast(true);
  // });
  // server.bind(1234);
}
