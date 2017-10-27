module.exports = function(app) {

	// Global variables
	var spawn = require('child_process').spawn;
	var diskspace = require('diskspace');
	var fs = require('fs');
	var path = "public/images/";
	var rpio = require('rpio');
	var vl6180 = require('./vl6180.js');
	var logger = require('./logger.js');
	var sensor = 0x29;
	var header = Date.now();
	header += "\n";
	logger.startLog("VL6180.txt")
	.then(logger.writeLog(__filename, header))
	.then(vl6180.read(sensor))
//	.then(function(data){ console.log(data) })
	.catch(function() {console.log("error")});

	// Error handling
	process.on('unhandledRejection', function(reason, p){
	  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	});

	// Reroute to index.html
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// Process read requests
	app.post('/read/:type', function(req, res) {
		var type = req.params.type;
		if (type == "disk"){
			diskspace.check('C', function (err, result){
				res.send(result);
			});
		}
	})

	// Process set requests
	app.post('/set/:type', function(req, res) {
		var type = req.params.type;
		console.log(type);
//		python(type, function(result){
//			res.send(result);
//		})
	})

	// Process downloading results
	app.post('/download', function(req, res){
		var svg = req.body.svg;
		fs.writeFile(path + "/img.svg", svg, function(err) {
		    if(err) { return console.log(err); }
				console.log("File stored as: ");
			});
//		res.download(req.body);
	});

/****************************/
/*		HELPER METHODS		*/
/****************************/

	// Run Python functionality
	function python(func, callback){

		var py = spawn('python', [func + '.py']);

		py.stdout.on('data', function(data){
			dataString += data.toString();
		});

		py.stdout.on('end', function(){
			console.log('Sum of numbers=', dataString);
		});

		py.stdin.write(JSON.stringify(data));
		py.stdin.end();

		callback(data);
	}
}
