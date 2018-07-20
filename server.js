const express = require('express'),
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

  if (process.argv[3] && process.argv[3] == 'skipsetup') {
    system.ready(true);
    for (var i = 0; i < system.OctoPrints.length; i++) system.OctoPrints[i].Printer = system.Printers[i];
  }
}



//Assign each server a printer
serial.refresh(system.testweb())
.then(() => {
  //if there are more ports than servers, throw an error
  //if (serial.length > system.OctoPrints.length) console.log('too many serial devices');

  //connect each server to a port
  //TODO: leave octoprint servers connected
  console.log('hello');
  for (var i = 0; i < serial.length; i++) {
    console.log(serial[i]);

    //system.OctoPrints[i].disconnect();
    //TODO: error handler: if the thing doesnt connect, try again a few times
    //system.OctoPrints[i].connect( serial[i] );
  }
});






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
