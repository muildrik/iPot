module.exports = function(app) {
	
	// Global variables
	var spawn = require('child_process').spawn;
	
	// Error handling
	process.on('unhandledRejection', function(reason, p){
	  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	});
	
	// Reroute to index.html
	app.get('/', function(req, res) {
		res.redirect("index.html");
		console.log("logged request");
	});
	
	// Process read requests
	app.post('/read/:type', function(req, res) {
		var type = req.params.type;
		console.log(type);
	})
	
	// Process set requests
	app.post('/set/:type', function(req, res) {
		var type = req.params.type;
		python(type, function(result){
			res.send(result);
		})
	})
	
	// Process downloading results
	app.post('/download', function(req, res){
		console.log("downloading");
	});
	
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