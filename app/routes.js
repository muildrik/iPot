module.exports = function(app) {
	
	// Global variables
	var spawn = require('child_process').spawn;
	var diskspace = require('diskspace');
	var fs = require('fs');
	var path = "public/images/";
	var rpio = require('rpio');
	
	rpio.open(12, rpio.OUTPUT, rpio.LOW);
	
	for (var i = 0; i < 5; i++) {
        /* On for 1 second */
        rpio.write(12, rpio.HIGH);
        rpio.sleep(1);
 
        /* Off for half a second (500ms) */
        rpio.write(12, rpio.LOW);
        rpio.msleep(500);
	}
	
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