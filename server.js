const express = require('express'),
      { exec } = require('child_process'),
      app = express(),
      http = require('http'),
      server = http.Server(app),
      upload = require('multer')(),

      io = require('socket.io')(server),
      scss = require('node-sass-middleware'),
      yaml = require('yamljs'),


      //my own files
      template = require('./utils/template.js')('public', app),
      serial = require('./utils/serial.js'),
      ip = require('./utils/ip.js'),
      system = require('./utils/system.js');



//load config file
var config = yaml.load('config.yaml');

for (var i = 0; i < config.Profiles.length; i++) new system.Profile(config.Profiles[i]);
for (var i = 0; i < config.Printers.length; i++) new system.Printer(config.Printers[i]);
for (var i = 0; i < config.OctoPrints.length; i++) new system.OctoPrint(config.OctoPrints[i]);


//check arguments for testweb
if (process.argv[2] && process.argv[2] == 'testweb') {
  console.log('(testweb mode)');
  system.testweb(true);
}



function forEachKey(object, fn) {
  let keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) fn(keys[i]);
}
function forEachInObject(object, fn) { forEachKey(object, (key) => { fn(object[key]); }); }
function clear(object) { forEachKey(object, (key) => { delete object[key]; }); }


function checkConnect() {
  //disconnect printers from ports
  clear(system.connectedPrinters);
  forEachInObject(system.Printers, (printer) => { printer.port = null; });

  //reconnect printers to ports
  serial.refresh().then(() => {
    for (let i = 0; i< serial.length; i++) {
      let port = serial[i],
          serialno = port.serialNumber;
          printer = system.Printers[serialno.toLowerCase()];
      if (printer) {
        printer.port = port;
        system.connectedPrinters[serialno] = printer;
      } else console.log('unrecognized serial number: ' + serialno);
    }

    let availablePrinters = {};
    Object.assign(availablePrinters, system.connectedPrinters);

    //console.log('connection');
    //system.OctoPrints[j++].attach(printer);

    for (let i = 0; i < system.OctoPrints.length; i++) {
      let octo = system.OctoPrints[i];
      octo.getconnect().then((res) => {
        let port = res.body.current.port;
        if (port == null) {
          port = Object.keys(availablePrinters)[0];
          console.log(octo.port + ' connecting to ' + port);
          if (port) octo.attach(availablePrinters[port]);
        } else {
          console.log(octo.port + ' already connected');
        }
        delete availablePrinters[port];
      });
    }


    setTimeout(checkConnect, 10000);
  });
}
checkConnect();





//rout scss
app.use(scss({
    src: __dirname + '/public/style/scss',
    dest: __dirname + '/public/style',
    prefix: '/style',
    outputStyle: 'compressed'
}));
//for reading the bodies of http posts
app.use(upload.any());




//index
app.get('/', (req, res) => {
  res.render('index.html', {
    Printers: system.Printers,
    OctoPrints: system.OctoPrints
  });
});


//just give whatever other files the client asks for
app.use(express.static(__dirname + '/public'));



var port = (system.testweb()) ? 8000:80;
server.listen(port, '0.0.0.0', () => {
  console.log('----Server Created----');
  console.log('\nGo to localhost:' + port + ' in your browser');
});
