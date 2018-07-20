nunjucks = require('nunjucks');
function init(dir, app) {
  nunjucks.configure(dir, {express: app, autoescape: true});
  return nunjucks;
}

module.exports = init;
