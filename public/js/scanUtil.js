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
	var sensorTracking = $("#sensorTracking");
	var sensorOutput = $("#sensorOutput");
	var totalSpace;
	var usedSpace;
	var freeSpace;
	var systemTime = $("#systemTimeLbl");
	var timeStamp = $("#timeStamp");
	var previewCanvasPeripherals = $("#previewCanvasPeripherals");
	var previewCanvasData = $("#previewCanvasData");
	var ctxPeri = previewCanvasPeripherals[0].getContext("2d");
	var ctxData = previewCanvasData[0].getContext("2d");
	var ctxSVG = new C2S(150,150);
	var coordinate = $("#coordinate");
	var activeSensor = $("#selectSensor");
	var currentSensor;	// Rotation angle for sensor
	var distance = $("#distance");
	var dist;
	var PI = 3.142;
	var R = 150;
	var canvasPeriWidth = previewCanvasPeripherals[0].width;
	var canvasPeriHeight = previewCanvasPeripherals[0].height;
	var canvasDataWidth = previewCanvasData[0].width;
	var canvasDataHeight = previewCanvasData[0].height;
	var distanceData = new Array;
	var rotatedArray = new Array;
	var distances = new Array;
	var r = 0;
	var g = 0;
	var b = 0;
	var a = 1;
	var cx = canvasDataWidth/2;
	var cy = canvasDataHeight/2;
	var diskRadius = 75;
	var sensorX = cx;
	var sensorY = cy;
	var angle = 3 * Math.PI / 180;
	
	/*************************************/
	/**				SETUP				**/
	/*************************************/
	
	getDiskData();
	var time = new Date();
	timeStamp.html(time.toString());
	
	switch(activeSensor.val()) {
		case "Sensor 1":
			setSensor(360);
			break;
		case "Sensor 2":
			setSensor(240);
			break;
		case "Sensor 3":
			setSensor(120);
			break;
		default:
			setSensor(360);
	}
	
	function setSensor(deg){
		currentSensor = deg;
		sensorX = cx - diskRadius * Math.cos(currentSensor * Math.PI / 180);
		sensorY = cy + diskRadius * Math.sin(currentSensor * Math.PI / 180);
	}
	
	function updateTime(){
		while(systemTime != Date.now()) {
			delay(1000)
			systemTime.html(Date.now());
		}
	}
	
	/*************************************/
	/**				SCAN				**/
	/*************************************/
	
	// Preview
	function updatePreview(){
        ctxPeri.beginPath();
        ctxPeri.arc(cx, cy, diskRadius, Math.PI * 2, 0);
        ctxPeri.closePath();
        ctxPeri.stroke();
		ctxPeri.drawImage(previewCanvasData[0], 0, 0);
	}
	
	// Detect selected sensor
	activeSensor.on("change", function(){
		switch(activeSensor.val()) {
			case "Sensor 1":
				setSensor(360);
				break;
			case "Sensor 2":
				setSensor(240);
				break;
			case "Sensor 3":
				setSensor(120);
				break;
			default:
				setSensor(360);
		}
	})
	
	// Get distance
	distance.on("change", function(){
		// Clear canvas of rotating platform for drawing
		clearCircle();
		
		// Draw previous data if any
		drawArray(rotatedArray, r, g , b, a);

		// Distance value -- to be replaced with measurement from sensor
		dist = distance.val();
		
		// Log raw distance value
		distances.push(dist);
		
		// Coordinate on X-axis of sensor
		var point = parseFloat(sensorX) + parseFloat(dist);
		
		// Rotate point around center of sensor
		var p = rotate(sensorX, sensorY, point, sensorY, currentSensor);
		
		// Draw point on platform canvas
		drawPoint(p, r, g, b, a);
		
		// Push point into array for rotation
		rotatedArray.push(p);
		
		// Rotate points in array around center of rotating platform by one gon
		rotateArray(rotatedArray);
		
		if (distance.val() == 360){
			// Connect the dots once the circle is full
		}
	})
	
	$("#connectDots").on("click", function(){
		drawLine(rotatedArray);
	})
	
	function drawPoint(point, r, g, b, a) {
		ctxData.fillRect(point[0], point[1], 2, 2);
	}
	
	function clearCircle(){
		ctxData.clearRect(0, 0, 150, 150);
	}
	
	function drawArray(array, r, g, b, a){
		for (var i = 0; i < array.length; i++) {
			ctxData.fillRect(array[i][0], array[i][1],2,2)
		}
	}
	
	function rotate(cx, cy, x, y, angle) {
		var radians = (Math.PI / 180) * angle;
		var	cos = Math.cos(radians);
		var	sin = Math.sin(radians);
		var	nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
		var	ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
		return [nx, ny];
	}
	
	function rotateArray(array) {
		for (var i = 0; i < array.length; i++) {
			array[i] = rotate(cx, cy, array[i][0], array[i][1], -1 * Math.PI);
		}
	}

	// When revolution is complete, connect the dots
	function drawLine(array){
//		clearCircle();
		var start = [array[0][0], array[0][1]];
		ctxSVG.beginPath();
		ctxSVG.moveTo(start[0], start[1]);
		for (var i = 1; i < array.length; i++) {
			if (i < array.length-1){
				var cpx = (array[i][0] + array[(i+1)][0]) / 2;
				var cpy = (array[i][1] + array[(i+1)][1]) / 2;
			}
			
			// Current curve follows original data points;
			// TODO: refine to average down sample scatter in one line!
			ctxSVG.quadraticCurveTo(cpx, cpy, array[i][0], array[i][1]);
			ctxSVG.stroke();
		}
		
		// Send SVG drawing to server for storage
		var drawing = ctxSVG.getSerializedSvg(true);
		
		var data = { "svg" : drawing };
		
		$.ajax({
			type: "post",
			url: "download",
			processData: false,
			contentType: 'application/json',
  			data: JSON.stringify(data)
		});
	}
	
	// Convert degrees to gons
	function deg2gon(deg){
		return (deg * 360) / 400;
	}
	
	/*************************************/
	/**				SETUP				**/
	/*************************************/
	function getDiskData(){
		return new Promise(function(resolve, reject){
			read("disk")
				.then(function(res){ $("#diskSpace").html(div(res.total)); totalSpace = res.total; $("#usedSpace").html(div(res.used)); usedSpace = res.used; $("#freeSpace").html(div(res.free)); freeSpace = res.free })
				.then(function() { makeChart() })
				.then(function() { resolve });
		});
	}
	
		function div(number) {
		var num = parseInt(number);
		if (num > 1000000000) {
			number = Math.round(num / 1000000000);
			num = number.toString() + " GB";
		} else if (number > 1000000) {
			number = Math.round(num / 1000000);
			num = number.toString() + " MB";
		} else if (number > 1000) {
			number = Math.round(num / 1000);
			num = number.toString() + " KB";
		}
		return num;
	}
	
	function makeChart(){
		var chart = AmCharts.makeChart("diskStatusChart", {
			"type": "pie",
			"theme": "light",
			"dataProvider": [ {
				"disk": "free",
				"value": freeSpace
				}, {
				"disk": "used",
				"value": usedSpace
				} ],
		  "valueField": "value",
		  "titleField": "disk",
		  "outlineAlpha": 0.4,
		  "depth3D": 15,
		  "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
		  "angle": 30,
		  "export": {
			"enabled": true
		  }
		} );
	}
	
	sensorOutput.hide();
	if (sensorTracking.attr("checked") == "checked"){
		sensorOutput.show();
	} else {
		sensorOutput.hide();
	}
	
	preview.on("change", function(){
		if (preview[0].checked != true) {
			$("#previewCanvasDiv").hide();
		} else {
			updatePreview();
			$("#previewCanvasDiv").show();
		}
	})
//	sensorTracking.toggle().then(function(){
//		$("#sensor1Output").show();
//	})
	
	scanSpeed.on("change", function() {
		c(scanSpeed.val());
//		console.log("change");
//		setSpeed();
	})
	
	laserLines.on("change", function() {
		set("laserLines", laserLines)
	})
	
	sensor1.on("change", function() {
		set("sensor1", sensor1);
	})
	
	sensor2.on("change", function() {
		set("sensor2", sensor2);
	})
	
	sensor3.on("change", function() {
		set("sensor3", sensor3);
	})
	
	/*************************************/
	/**				FUNCTIONS			**/
	/*************************************/
	function read(url) {
		return $.post({ url: "read/" + url });
	}
	
	function set(url) {
		return $.post({ url: "set/" + url });
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
	
	function c(l) {
		console.log(l);
	}
})