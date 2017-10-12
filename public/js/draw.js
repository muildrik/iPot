$(document).ready(function(){
	
	/*************************************/
	/**				VARIABLES			**/
	/*************************************/

	var previewCanvasPeri = $("#previewCanvasPeripherals");
	var ctx = previewCanvasPeri[0].getContext("2d");
	var canvasWidth = previewCanvasPeri[0].width;
	var canvasHeight = previewCanvasPeri[0].height;
	var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	var r, g, b, a;
	
	var scanData = [0,0];
	
	var nodeColor = $("#nodeColor");
	
	nodeColor.on("change", function(){
		var rgba = hexToRgbA(nodeColor.val());
		r = rgba[0];
		g = rgba[1];
		b = rgba[2];
		a = rgba[3];
	})
	
	// Activate pixel value
	function drawPixel (x, y, r, g, b, a) {
    	var index = (x + y * canvasWidth) * 4;
		canvasData.data[index + 0] = r;
		canvasData.data[index + 1] = g;
		canvasData.data[index + 2] = b;
		canvasData.data[index + 3] = a;
	}
	
	// Connect dots with line
	function drawLine(point){
		ctx.moveTo(point[0], point[1]);
		ctx.lineTo(100, 100);
		ctx.stroke();
	}
	
	// Draw on canvas
	function updateCanvas() {
		ctx.putImageData(canvasData, 0, 0);
	}
	
	// Convert color values to RGBA
	function hexToRgbA(hex){
		var c;
		if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
			c = hex.substring(1).split('');
			if (c.length == 3){
				c = [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c = '0x' + c.join('');
			
			return [(c>>16)&255, (c>>8)&255, c&255, c&1]
		}
		throw new Error('Bad Hex');
	}
})