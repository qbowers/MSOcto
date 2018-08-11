const http = require('http');


function OctoPrint(data) {
  this.hostname = hostname;

  //gives all the properties of data to this instance
  Object.assign(this, data);


  //generic http request template
  this.request = (method, path, successcode, params = null, headers = null) => {
    var body = '',
        options = {
          method: method,
          hostname: this.hostname,
          port: this.port,
          path: path,
          headers: {'X-Api-Key': this.apikey}
        };
    if (headers) Object.assign(options.headers, headers);

    return new Promise((resolve, reject) => {
      var req = http.request(options, (res) => {
        res.on('data', (d) => {body += d; });
        res.on('end', () => {


          if (successcode && res.statusCode != successcode) {
            reject({
              status: res.statusCode,
              body: body
            });
          } else resolve({
            status: res.statusCode,
            body: (body.length != 0) ? JSON.parse(body) : null
          });


        });
      });
      req.on('error', reject);

      if (params) req.write(JSON.stringify(params));
      req.end();
    });
  };

  //http request methods
  this.get = (path, successcode) => { return this.request('GET', path, successcode); }
  this.delete = (path, successcode, params, headers = null) => { return this.request('DELETE', path, successcode, params, headers); }
  this.post = (path, successcode, params, headers = {'Content-Type': 'application/json'}) => { return this.request('POST', path, successcode, params, headers); }
  this.patch = (path, successcode, params, headers = null) => { return this.request('PATCH', path, successcode, params, headers); }



  this.getconnect = () => {
    if (testweb) return new Promise((resolve, reject) => { resolve() });
    else return this.get('/api/connection', 200);
  }
  this.connect = (serialport, profile = null, baud = null) => {
    if (testweb) {  //to test website
      this.serialport = serialport;
      return new Promise((resolve, reject) => { resolve() });
    } else {        //normal opperation
      var params = {
        command: 'connect',
        port: serialport.comName
      };
      if (baud) params.baud = baud;
      if (profile) params.profile = profile;

      return this.post('/api/connection', 204, params).then((res) => {
        this.serialport = serialport;
        console.log(this.port + ' connected to ' + this.serialport.comName);
      });
    }
  }
  this.disconnect = () => {
    if (testweb) {  //to test website
      //console.log('(testweb) ' + this.port + ' disconnected');
    } else {          //normal opperation
      var params = {command: 'disconnect'};
      return this.post('/api/connection', 204, params);
    }
  }







  //--------UNTESTED
  //these are api commands that I found on the octoprint website that I figured would be useful
  this.file = {
    upload: () => {
      // DO STUFF
    },
    print: (filename) => {
      if (testweb) {} //to test website
      else {          //normal operation
        var params = {command: 'select', print: true};
        return this.post('/api/files/local/' + filename, 204, params);
      }
    },
    slice: (filename, options) => {
      if (testweb) {} //to test website
      else {          //normal operation
        var params = {
          command: 'slice',
          slicer: 'cura',
          gcode: filename + '.gcode'
        };
        Object.assign(params, options);

        return this.post('/api/files/local/' + filename, 202, params);
      }
    },
    info: (filename) => {
      if (testweb) {} //to test website
      else return this.get('/api/files/local/' + filename, 200); //normal operation
    }
  }
  //-----------UNTESTED
  this.job = {
    start: () => {
      if (testweb) {} //to test website
      else return this.post('/api/job', 204, {command: 'start'}); //normal operation
    },
    cancel: () => {
      if (testweb) {} //to test website
      else return this.post('/api/job', 204, {command: 'cancel'}); //normal operation
    },
    pause: () => {
      if (testweb) {} //to test website
      else return this.post('/api/job', 204, {command: 'pause', action: 'pause'}); //normal operation
    },
    resume: () => {
      if (testweb) {} //to test website
      else return this.post('/api/job', 204, {command: 'pause', action: 'resume'}); //normal operation
    },
    info: () => {
      if (testweb) {} //to test website
      else return this.get('/api/job', 200); //normal operation
    }
  }
  //----------UNTESTED
  this.printer = {
    info: () => {
      if (testweb) {} //to test website
      else return this.get('/api/printer?exclude=temperature,sd', 200); //normal operation
    },
    setSpeed: (speed) => {
      if (testweb) {} //to test website
      else {          //normal operation
        var params = {
          command: 'feedrate',
          factor: speed
        };
        return this.post('/api/printer/printhead', 204, params);
      }
    },
    jog: (x,y,z) => {
      if (testweb) {} //to test website
      else {          //normal operation
        var params = {
          command: 'jog',
          x: x,
          y: y,
          z: z
        };
        return this.post('/api/printer/printhead', 204, params);
      }
    },
    //except this one, this one works fine
    home: (axesString) => {
      if (testweb) {} //to test website
      else {          //normal operation
        var axes = [];
        for (var i = 0; i < axesString.length; i++) axes.push(axesString.charAt(i));
        var params = {
          command: 'home',
          axes: axes
        };
        return this.post('/api/printer/printhead', 204, params);
      }
    },


    //TO DO
    tool: (tool) => {
      if (testweb) {} //to test website
      else {          //normal operation
        var params = {
          command: ''
        };
        return this.post('/api/printer/tool', 204, params);
      }
    },
    temp: () => {

    }
  }










  //essentially, the server will make the printer wiggle for a given time, and then stop
  this.wiggle = {
    setTime: (time) => {
      time *= 1000;
      if (time > this.wiggle.time) this.wiggle.time = time;
      if (!this.wiggle.iswiggling) {
        this.wiggle.wiggle();
        this.wiggle.iswiggling = true;
      }
    },
    stop: () => {
      this.wiggle.time = 0;
      this.wiggle.iswiggling = false;
    },
    wiggle: () => {
      this.printer.home('xyz');

      this.wiggle.time -= this.wiggle.delay
      if (this.wiggle.time > 0) setTimeout(this.wiggle.wiggle, this.wiggle.delay);
      else this.wiggle.stop();
    },
    time: 0,
    state: false,
    delay: 1000,
    iswiggling: false
  }



  //constructor adds every instance to an array
  OctoPrints.push(this);
}

















function Printer(data) {


  //name
  //color
  //status (ready, not ready, in use, unloaded)
  //active

  Object.assign(this, data);

  //set profile to an actual profile, not just a name
  for (var i = 0; i < Profiles.length; i++) if (Profiles[i].id == this.type) { this.Profile = Profiles[i]; break; }


  //progress
  //job
  //server
  //temp = {}

  this.changeColor = () => {}

  this.setHeat = (temp) => {}
  this.setBedHeat = (temp) => {}

  this.moveTool = (data) => {}

  this.attach = (octoprint) => {
    octoprint.Printer = this;
    this.OctoPrint = octoprint;
  }

  this.match = (octoprint) => {
    //determine if octoprint is compatible based on serial port and associated profile info
    //or if the printer is already connected
    return (!this.OctoPrint && true);
  }

  //constructor adds every instance to an array
  Printers.push(this);
}

//classes I might need later
function Job(data) {

}
function SlicingProfile(data) {

}

//Other stuff I might need later
function Profile(data) {
  this.heatedBed = false;
  Object.assign(this, data);
  this.obj = () => {
    return {
      id: this.id,
      name: this.name,
      volume: {
        formFactor: 'rectangular',
        origin: 'lowerleft',
        width: this.volume.x,
        depth: this.volume.y,
        height: this.volume.z,
        custom_box: false
      }
    }
  }
  Profiles.push(this);
}

//functions for adding printers or printer types to the system
//might add them later
function newPrinter() {

}
function newProfile() {

}


const hostname = '10.20.81.187';
var ready = true,
    testweb = false,
    OctoPrints = [],
    Printers = [],
    Profiles = [],
    jobs = [];





module.exports.OctoPrint = OctoPrint;
module.exports.OctoPrints = OctoPrints;
module.exports.Printer = Printer;
module.exports.Printers = Printers;
module.exports.Profile = Profile;
module.exports.Profiles = Profiles;
module.exports.ready = function(val = null) {if (val == null) return ready; else ready = val};
module.exports.testweb = function(val = null) {if (val == null) return testweb; else testweb = val};
