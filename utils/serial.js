const serialports = require('serialport');

var serial = {
  portstring: '/dev/ttyUSB',
  //portstring: 'COM',
  refresh: (testweb = false) => {

    //if serial already has ports listed, kill them
    if (serial.length) for (var i = 0; i < serial.length; i++) serial[i] = null;
    serial.length = 0;


    if (testweb) { //if this is fake, make some fake ports
      return new Promise((resolve, reject) => {
        for (var i = 0; i < 8; i++) serial[i] = {comName: serial.portstring + i};
        serial.length = 8;
        resolve();
      });
    } else { //if not, we should probably find some real ones
      return serialports.list().then((ports) => {
        ports.forEach((port) => { if (port.comName.includes(serial.portstring)) serial[serial.length++] = port; });
      });
    }
  }
}

module.exports = serial;
