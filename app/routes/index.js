var routes = require('./cows');
module.exports = function(app, db){
	routes(app, db);
}