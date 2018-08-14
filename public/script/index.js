let graphs = $('.graph').toArray();
for (let i = 0; i < graphs.length; i++) {
  graphs[i].height = 200;
  graphs[i].width = 200;
}


class Graph {
  constructor(id) {
    this.e = document.getElementById(id);
    this.ctx = this.e.getContext('2d');

    this.w = this.e.width;
    this.h = this.e.height;

    this.dataset = {
      extruder: {
        points: [0,20,10],
        color: '#0000ff',
        text: 'EX: 200'
      },
      bed: {
        color: '#ff0000',
        points: [30,20,90, this.h],
        text: 'BED: 60'
      }
    };
    this.numpoints = 10;
    this.spacing = this.w/this.numpoints;

    this.max = 200;
  }



  render() {
    let ctx = this.ctx;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,this.w,this.h);


    for (let i = 0; i < Object.keys(this.dataset).length; i++) {
      let dataset = this.dataset[Object.keys(this.dataset)[i]];

      ctx.strokeStyle = dataset.color;
      let points = dataset.points;

      ctx.beginPath();
      ctx.moveTo(this.w, this.h - points[0]);
      for (let j = 1; j < points.length; j++) ctx.lineTo(this.w - j*this.spacing,this.h - this.h*points[j]/this.max);
      ctx.stroke();
    }
  }

  push(dataset) {
    let keys = Object.keys(dataset);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = dataset[key];

      let points = this.dataset[key].points;
      points.unshift(value);
      while(this.numpoints < points.length -1) points.pop();
    }

    this.render();
  }
}
