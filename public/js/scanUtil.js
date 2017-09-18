$(document).ready(function(){
	
	/*************************************/
	/**				VARIABLES			**/
	/*************************************/
	var scanSpeed = $("#scanSpeed");
	var laserLines = $("#laserLinesChkBox");
	var preview = $("#previewChkBox");
	var sensor1 = $("#useSensor1");
	var sensor2 = $("#useSensor2");
	var sensor3 = $("#useSensor3");
	var layout = $("#layout");
	var downloadLayout = $("#downloadLayout");
	var layoutType = $("#layoutType");
	var fileType = $("fileType");
	var autoFit = $("#autoFit");
	var DPI = $("#DPI");
	var scanBtn = $("#scanBtn");
	var downloadBtn = $("#downloadBtn");
	var cpuBattLife = $("#cpuBattLife");
	var senBattLife = $("#senBattLife");
	
	/*************************************/
	/**				SETUP				**/
	/*************************************/
	scanSpeed.on("change", function() {
		console.log("change");
//		setSpeed();
	})
	
	laserLines.on("change", function() {
		set("laserLines", laserLines)
	})
	
	sensor1.on("change", function() {
		setSensor1();
	})
	
	sensor2.on("change", function() {
		setSensor2();
	})
	
	sensor3.on("change", function() {
		setSensor3();
	})
	
	/*************************************/
	/**				FUNCTIONS			**/
	/*************************************/
	function read(url) {
		$.ajax({
			type: "POST",
			url: "read/" + url
		}).done(function(data) {
			console.log(data);
			return(data);
		});
	}
	
	function set(url) {
		$.ajax({
			type: "POST",
			url: "set/" + url
		}).done(function(data) {
			console.log(data);
			return(data);
		});
	}
	
	/* Read rotation speed */
	function readSpeed(){
		console.log(read("spinBase"));
	}
	
	/* Set Rotation speed */
	function setSpeed(){
		set("spinBase", scanSpeed).then(function(res){
			console.log(res);
		});
	}
	
	/* Read laser lines */
	function readLaser(){
		console.log(read("laserLines"));
	}
	
	/* Set laser lines */
	function setLaser(){
		set("laserLines", laserLines).then(function(res){
			console.log(res);
		});
	}
	
	/* Read sensor 1 */
	function readSensor1(){
		console.log(read("sensor1"));
	}
	
	/* Set sensor 1 */
	function setSensor1(){
		set("sensor1", sensor1).then(function(res){
			console.log(res);
		});
	}
	
	/* Read sensor 2 */
	function readSensor2(){
		console.log(read("sensor2"));
	}
	
	/* Set sensor 2 */
	function setSensor2(){
		set("sensor2", sensor2).then(function(res){
			console.log(res);
		});
	}
	
	/* Read sensor 3 */
	function readSensor3(){
		console.log(read("sensor3"));
	}
	
	/* Set sensor 3 */
	function setSensor3(){
		set("sensor1", sensor3).then(function(res){
			console.log(res);
		});
	}
	
	/* Process scan data */
})